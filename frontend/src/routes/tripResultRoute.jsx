import { useContext } from "react"
import {useNavigate} from "react-router"
import routeContext from "../contexts/routeContext"
import { Loader2 } from "lucide-react"
import {motion} from "framer-motion"
const TripResultRoute = ({children})=>{
    const navigate = useNavigate()
    const {loading, routePath} = useContext(routeContext);
    if(loading){
        return (<div className="h-screen bg-slate-900 flex justify-center items-center">
            <div className="flex flex-col gap-3 items-center bg-slate-900/50 rounded-md border-2 border-slate-200 p-4">
                <motion.div><Loader2 size={20} className="text-white"/></motion.div>
                <p className="text-white text-xl">Please wait</p>
            </div>
        </div>)
    }
    else if(!routePath)
        navigate('/plan-trip')
    console.log(loading, routePath)
    return children
}
export default TripResultRoute