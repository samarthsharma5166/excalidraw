import { Tools } from "@/components/Canvas"
import { HTTP_BACKEND_URL } from "@/config"
import axios from "axios"

type shape = {
    type:"ract",
    x:number,
    y:number,
    width:number,
    height:number
} | {
    type:"circle",
    centerX:number,
    centerY:number,
    radius:Number,
} | {
    type:"line",
    x1:number,
    y1:number,
    x2:number,
    y2:number
}
export async function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
  const existingShape: shape[] = (await getExistingShape(roomId));
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  socket.onmessage = (e) => {
    const mess= JSON.parse(e.data);
    if(mess.type="chat"){
        const parsedData= JSON.parse(mess.message);
        existingShape.push(parsedData);
        clearCanvas(existingShape, canvas, ctx);
    }
  }

  clearCanvas(existingShape, canvas, ctx);
  let clicked = false;
  let StartX = 0;
  let StartY = 0;
  ctx.fillStyle = "black";
  ctx.strokeStyle = "white";

  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    StartX = e.clientX;  
    StartY = e.clientY;
  });
  canvas.addEventListener("mouseup", (e) => {
    clicked = false;
    const width = e.clientX - StartX;
    const height = e.clientY - StartY;
    let fig: shape | null = null;
    // @ts-ignore
    if (window.selectedTool === Tools.SQUARE) {
      fig= {
        // @ts-ignore
        type: window.selectedTool,
        x: StartX,
        y: StartY,
        width,
        height,
      };
    }
    // @ts-ignore
    if (window.selectedTool === Tools.CIRCLE) {
      const radius = Math.max(width, height) / 2;
      fig = {
        type:'circle',
        radius,
        centerX:StartX + radius,
        centerY:StartY + radius
      }
    }
    if(!fig) return
    existingShape.push(fig);
    socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify({ ...fig }),
        roomId,
      })
    );
  });
  canvas.addEventListener("mousemove", (e) => {
    if (clicked) {
      const width = e.clientX - StartX;
      const height = e.clientY - StartY;
      clearCanvas(existingShape, canvas, ctx);
      ctx.strokeStyle = "white";
      // @ts-ignore
      if (window.selectedTool === Tools.SQUARE) {
        ctx.strokeRect(StartX, StartY, width, height);
      }
      // @ts-ignore
      if(window.selectedTool === Tools.CIRCLE){
        const centerX = (StartX + width)/2
        const centerY = (StartY + width) / 2;
        const radius = Math.max(width,height)/2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
      }
    }
  });
}

function clearCanvas(existingShape:shape[],canvas:HTMLCanvasElement,ctx:CanvasRenderingContext2D){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";

    console.log(existingShape);
    existingShape.map((shape) => {
      if (shape.type === "ract") {
        ctx.strokeStyle = "white";
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      }

      if (shape.type === Tools.CIRCLE) {
        ctx.beginPath();
        ctx.arc(shape.centerX, shape.centerY, Number(shape.radius), 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
      }
    });
}

async function getExistingShape(roomId:string){
  const token = localStorage.getItem('token');
  console.log(token)
    const res= await axios.get(`${HTTP_BACKEND_URL}/chat/${roomId}`,{
      headers:{
        Authorization:localStorage.getItem('token')
      }
    });
    const data = res.data.messages;
    console.log(data)
    const shapes = await data.map((x:{success:boolean,message:string})=>{
        const messageData = JSON.parse(x.message)
        return messageData;
    })
    return shapes;
}