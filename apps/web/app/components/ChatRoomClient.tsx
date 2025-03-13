"use client"

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

 export function ChatRoomClient({messages,id}:{
    messages:{message:string}[];
    id:string
 }){
    const [chat ,setChat] = useState(messages);
    const {socket,loading} = useSocket();
    const [currentMessage,setCurrentMessage] = useState("");

    useEffect(()=>{
        if(socket && !loading){

            socket.send(JSON.stringify({
                type:'join',
                roomId:id
            }))
            socket.onmessage = (e)=>{
                const data = JSON.parse(e.data);
                if(data.type === 'chat'){
                    setChat([...chat,data.message])
                }
            }
        }
    },[socket,loading,id])
    return (
        <div>
            {chat.length > 0 && chat.map((message,index)=>{
                return <div key={index}>{message.message}</div>
            })}
            <div>
                <input type="text"  onChange={(e)=>setCurrentMessage(e.target.value)}/>
                <button onClick={()=>{
                    socket?.send(JSON.stringify({
                        type:'chat',
                        roomId:id,
                        message:currentMessage
                    }))
                    setCurrentMessage("")
                }} >Send</button>   
            </div>
        </div>
    )
 }