import { WS_URL } from "@/config";
import { useEffect, useState } from "react";

const GetSocketConn = (roomId:string) => {
    const[loading, setLoading] = useState(true);
    const[socket, setSocket] = useState<WebSocket>();   
    useEffect(()=>{
        const ws = new WebSocket(`${WS_URL}?token=${localStorage.getItem("token")}`);
        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
            ws.send(JSON.stringify({
                type:"join_room",
                roomId
            }))
        }
    },[])
    return {socket,loading}
}

export default GetSocketConn