class status:
    ON = "ON"
    OFF = "OFF"
    D = "D"
    SB = "SB"


class ELDComplianceError(Exception):
    """Raised when a compliant log cannot be generated under FMCSA HOS rules."""
    pass


def generate_eld_logs(estimated_time_of_journey, current_time):
    """
    Generate FMCSA-compliant ELD logs for a single continuous trip.

    Args:
        estimated_time_of_journey: total driving hours needed to complete the trip (float > 0)
        current_time: hour of day (0-24) the driver starts the trip

    Returns:
        List of days, each day a list of {'start', 'end', 'status'} dicts
        (start/end are hours-of-day, 0-24), covering full 24h per day.

    Raises:
        ValueError: invalid inputs
        ELDComplianceError: trip cannot be completed without a 34-hour restart
                             (70-hr/8-day cycle exhausted)
    """
    if estimated_time_of_journey is None or estimated_time_of_journey <= 0:
        raise ValueError("estimated_time_of_journey must be a positive number of hours")
    if current_time is None or not (0 <= current_time <= 24):
        raise ValueError("current_time must be between 0 and 24")

    MAX_DRIVE_PER_WINDOW = 11.0
    MAX_DUTY_WINDOW = 14.0
    MAX_DRIVE_BEFORE_BREAK = 8.0
    BREAK_DURATION = 0.5
    OFF_DUTY_RESET = 10.0
    MAX_CYCLE_HOURS = 70.0
    EPS = 1e-9

    remaining_drive = float(estimated_time_of_journey)
    cycle_hours_used = 0.0

    raw_segments = []
    t = float(current_time)

    def add_segment(abs_start, abs_end, seg_status):
        if abs_end - abs_start <= EPS:
            return
        raw_segments.append((abs_start, abs_end, seg_status))

    safety_counter = 0
    while remaining_drive > EPS:
        safety_counter += 1
        if safety_counter > 100000:
            raise ELDComplianceError("Unable to generate logs: possible infinite loop")

        if cycle_hours_used >= MAX_CYCLE_HOURS - EPS:
            raise ELDComplianceError(
                "70-hour/8-day cycle limit reached before trip completion; "
                "driver requires a 34-hour restart before continuing"
            )

        window_start = t
        window_drive_used = 0.0
        drive_since_break = 0.0

        while (
            remaining_drive > EPS
            and window_drive_used < MAX_DRIVE_PER_WINDOW - EPS
            and (t - window_start) < MAX_DUTY_WINDOW - EPS
            and cycle_hours_used < MAX_CYCLE_HOURS - EPS
        ):
            drive_cap_by_11 = MAX_DRIVE_PER_WINDOW - window_drive_used
            drive_cap_by_14 = MAX_DUTY_WINDOW - (t - window_start)
            drive_cap_by_break = MAX_DRIVE_BEFORE_BREAK - drive_since_break
            drive_cap_by_cycle = MAX_CYCLE_HOURS - cycle_hours_used

            if drive_cap_by_break <= EPS:
                add_segment(t, t + BREAK_DURATION, status.OFF)
                t += BREAK_DURATION
                drive_since_break = 0.0
                continue

            drive_chunk = min(
                drive_cap_by_11, drive_cap_by_14, drive_cap_by_break,
                drive_cap_by_cycle, remaining_drive
            )

            if drive_chunk <= EPS:
                break

            add_segment(t, t + drive_chunk, status.D)
            t += drive_chunk
            window_drive_used += drive_chunk
            drive_since_break += drive_chunk
            remaining_drive -= drive_chunk
            cycle_hours_used += drive_chunk

            if remaining_drive <= EPS:
                break

            if drive_since_break >= MAX_DRIVE_BEFORE_BREAK - EPS:
                add_segment(t, t + BREAK_DURATION, status.OFF)
                t += BREAK_DURATION
                drive_since_break = 0.0

        if remaining_drive > EPS:
            add_segment(t, t + OFF_DUTY_RESET, status.OFF)
            t += OFF_DUTY_RESET

    day_segments = {}

    for abs_start, abs_end, seg_status in raw_segments:
        cursor = abs_start
        while cursor < abs_end - EPS:
            day_index = int(cursor // 24)
            day_end_abs = (day_index + 1) * 24
            seg_end = min(abs_end, day_end_abs)
            local_start = cursor - day_index * 24
            local_end = seg_end - day_index * 24
            day_segments.setdefault(day_index, []).append((local_start, local_end, seg_status))
            cursor = seg_end

    if not day_segments:
        raise ELDComplianceError("No log segments generated")

    eld_logs = []
    for day_index in range(min(day_segments.keys()), max(day_segments.keys()) + 1):
        segs = sorted(day_segments.get(day_index, []), key=lambda s: s[0])
        filled = []
        cursor = 0.0
        for local_start, local_end, seg_status in segs:
            if local_start - cursor > EPS:
                filled.append({'start': cursor, 'end': local_start, 'status': status.OFF})
            filled.append({'start': local_start, 'end': local_end, 'status': seg_status})
            cursor = local_end
        if 24.0 - cursor > EPS:
            filled.append({'start': cursor, 'end': 24.0, 'status': status.OFF})
        eld_logs.append(filled)

    return eld_logs