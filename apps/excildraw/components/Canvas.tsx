// import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import IconButton from "./IconButton";
import {Circle,Eraser,Minus,MousePointer,Pen,PencilLine,PenLine,Square} from 'lucide-react'
import { Game } from "@/draw/Game";
import eraser from './eraser.png'
import Image from "next/image";
export enum Tools {
    PEN = "pen",
    CIRCLE = "circle",
    SQUARE = "ract",
    Line = "line",
    SELECTION = "selection",
    TEXT = "text",
    ERASER = "Eraser"
}
const Canvas = ({roomId,socket}:{roomId:string,socket:WebSocket}) => {

    const [selectedTool,setSelectedTool] = useState<Tools>(Tools.SELECTION);
    const [game,setGame] = useState<Game>();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const g = new Game(canvas,roomId,socket)
            setGame(g);
            return ()=>{
              g.destroye()
            }
        }
    }, [canvasRef,roomId,socket])

    useEffect(() => {
      game?.setTool(selectedTool)
      if(canvasRef.current){
        switch (selectedTool) {
          case Tools.ERASER:
            canvasRef.current.style.cursor = `url(${eraser}), auto`;
            break;
          default:
            canvasRef.current.style.cursor = `auto`;
          break;
        }
      }
    },[selectedTool,game])
  return (
    <div className="h-screen overflow-hidden">
          <canvas ref={canvasRef} id="myCanvas" width={window.innerWidth} height={window.innerHeight} className=" border-gray-500 shadow-[0_10px_35px_#000]">
          </canvas>
         <TopBar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
    </div>
  )
}

export default Canvas

export function TopBar({selectedTool,setSelectedTool}:{selectedTool:Tools,setSelectedTool:React.Dispatch<React.SetStateAction<Tools>>}){
return(
  <div className="flex gap-2 border p-2 text-sm fixed top-2 rounded-md left-[50%] transform -translate-x-1/2  text-white" >
    <IconButton activated={selectedTool === Tools.SELECTION} icon={<MousePointer/>} onClick={() => { setSelectedTool(Tools.SELECTION) }} />
    <IconButton activated={selectedTool === Tools.PEN} icon={<PencilLine />} onClick={() => { setSelectedTool(Tools.PEN) }} />
    <IconButton activated={selectedTool === Tools.CIRCLE} icon={<Circle />} onClick={() => setSelectedTool(Tools.CIRCLE)} />
    <IconButton activated={selectedTool === Tools.SQUARE} icon={<Square />} onClick={() => { setSelectedTool(Tools.SQUARE) }} />
    <IconButton activated={selectedTool === Tools.Line} icon={<Minus/>} onClick={() => { setSelectedTool(Tools.Line) }} />
    <IconButton activated={selectedTool === Tools.TEXT} icon={<p className="text-xl">A</p>} onClick={() => { setSelectedTool(Tools.TEXT) }} />
    <IconButton activated={selectedTool === Tools.ERASER} icon={<Eraser />} onClick={() => setSelectedTool(Tools.ERASER)} />
  </div>
)
}