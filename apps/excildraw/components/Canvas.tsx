import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import IconButton from "./IconButton";
import {ArrowBigLeft, Circle,Pen,Square} from 'lucide-react'
import { Game } from "@/draw/Game";

export enum Tools {
    PEN = "pen",
    CIRCLE = "circle",
    SQUARE = "ract",
    Line = "line"
}
const Canvas = ({roomId,socket}:{roomId:string,socket:WebSocket}) => {
    const [selectedTool,setSelectedTool] = useState<Tools>(Tools.PEN);
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
    }, [canvasRef])

    useEffect(() => {
      console.log(selectedTool)
      game?.setTool(selectedTool)
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
    <IconButton activated={selectedTool === Tools.PEN} icon={<Pen />} onClick={() => { setSelectedTool(Tools.PEN) }} />
    <IconButton activated={selectedTool === Tools.CIRCLE} icon={<Circle />} onClick={() => setSelectedTool(Tools.CIRCLE)} />
    <IconButton activated={selectedTool === Tools.SQUARE} icon={<Square />} onClick={() => { setSelectedTool(Tools.SQUARE) }} />
    <IconButton activated={selectedTool === Tools.Line} icon={<svg width="100" height="10" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="5" x2="100" y2="5" stroke="black" strokeWidth="2" />
    </svg>} onClick={() => { setSelectedTool(Tools.Line) }} />

  </div>
)
}