import sys
class status:
    ON = "ON"
    OFF = "OFF"
    D  = "D"
    SB = "SB"
    
    
def generate_eld_logs(estimated_time_of_journey, current_time):
    # This function generates eld logs. It takes current time of the the client
    # The format of eld logs is [{day, start, end}.....]
    # Over the journey the status of driver changes between ["OFF, "ON", "D", "SB"]
    eld_logs = [{'start': 0, 'end': 4, 'status': status.ON}, {'start':4, 'end':12, 'status': status.OFF}]
    return eld_logs