"use client"

import { initDraw } from "@/draw";
import GetSocketConn from "@/hooks/GetSocketConn";
import { useEffect, useRef } from "react";
import Canvas from "./Canvas";

export function RoomCanvas({roomId}:{roomId:string}) {
    const {socket,loading} = GetSocketConn(roomId);

    if(loading || !socket){
        return <div>Loading...</div>
    }
    return (
        <Canvas socket={socket}  roomId={roomId}/>
    )
}
