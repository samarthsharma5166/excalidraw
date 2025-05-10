import { Tools } from "@/components/Canvas";
import { getExistingShape } from "./http";
import  rough from 'roughjs'
import { RoughCanvas } from "roughjs/bin/canvas";
interface Point {
  x: number;
  y: number;
}
type shape =
  | {
      id?: number;
      type: "ract";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      id?: number;
      type: "circle";
      centerX: number;
      centerY: number;
      radius: Number;
    }
  | {
      id?: number;
      type: "line";
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    }
  | {
      id?: number;
      type: "pen";
      inputpoint: number[][];
    };
export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShape: shape[] = [];
  private roomId: string;
  private socket: WebSocket;
  private clicked = false;
  private StartX = 0;
  private StartY = 0;
  private centerX = 0;
  private centerY = 0;
  private width = 0;
  private height = 0;
  private selectedTool: Tools;
  private radius = 0;
  private figure: shape | null = null;
  private inputpoint: number[][] = [];
  private moving: boolean = false;
  private movingShape: shape | null = null;

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.roomId = roomId;
    this.socket = socket;
    this.clicked = false;
    this.selectedTool = Tools.SQUARE;
    this.init();
    this.initHandlers();
    this.clearCanvas();
    this.initMouseHandlers();
    this.setTool(this.selectedTool);
  }

  destroye() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
  }

  async init() {
    this.existingShape = await getExistingShape(this.roomId);
    this.clearCanvas();
  }

  setTool(tool: Tools) {
    this.selectedTool = tool;
  }

  initHandlers() {
    this.socket.onmessage = (e) => {
      const mess = JSON.parse(e.data);
      if (mess.type === "chat") {
        const parsedData = JSON.parse(mess.message);
        this.existingShape.push(parsedData);
        this.clearCanvas();
      }
      if (mess.type === "updatedChat") {
        const parsedData = JSON.parse(mess.message);
        const message = JSON.parse(parsedData.message);
        this.existingShape = this.existingShape.map((shape) => {
          if (shape.id === parsedData.id) {
            if (shape.type === "ract") {
              shape.x = message.x;
              shape.y = message.y;
              shape.width = message.width;
              shape.height = message.height;
            }
            if (shape.type === "circle") {
              shape.centerX = message.centerX;
              shape.centerY = message.centerY;
              shape.radius = message.radius;
              console.log(shape);
            }
            if (shape.type === "line") {
              shape.x1 = message.x1;
              shape.y1 = message.y1;
              shape.x2 = message.x2;
              shape.y2 = message.y2;
            }
            if (shape.type === "pen") {
              shape.inputpoint = message.inputpoint;
            }
          }
          return shape;
        });
        this.clearCanvas();
      }
    };
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.strokeStyle = "white";
    if (this.movingShape) {
      const padding = 2; // Extra space around the shape
      this.ctx.strokeStyle = "#00ff00"; // Green highlight color

      if (this.movingShape.type === "ract") {
        // this.ctx.strokeStyle = "Blue";
        this.ctx.strokeRect(
          this.movingShape.x -padding,
          this.movingShape.y - padding,
          this.movingShape.width + padding * 2 ,
          this.movingShape.height + padding * 2
        );
        this.ctx.strokeStyle = "white";
        this.ctx.strokeRect(
          this.movingShape.x,
          this.movingShape.y,
          this.movingShape.width,
          this.movingShape.height
        );
      }
      if (this.movingShape.type === "circle") {
        this.ctx.strokeRect(  
          this.movingShape.centerX - Math.abs(Number(this.movingShape.radius))  - padding,
          this.movingShape.centerY - Math.abs(Number(this.movingShape.radius)) - padding,
          Math.abs(Number(this.movingShape.radius)) * 2 + padding ,
          Math.abs(Number(this.movingShape.radius)) * 2 + padding 
        )
        this.ctx.strokeStyle = "white";
        this.ctx.beginPath();
        this.ctx.arc(
          this.movingShape.centerX,
          this.movingShape.centerY,
          Math.abs(Number(this.movingShape.radius)),
          0,
          2 * Math.PI
        );
        this.ctx.stroke();
        this.ctx.closePath();
      }
      if (this.movingShape.type === "line") {
        this.ctx.beginPath();
        this.ctx.moveTo(this.movingShape.x1, this.movingShape.y1);
        this.ctx.lineTo(this.movingShape.x2, this.movingShape.y2);
        this.ctx.stroke();
        this.ctx.closePath();
      }
      if (this.movingShape.type === "pen") {
        let minX = Infinity,
          minY = Infinity,
          maxX = -Infinity,
          maxY = -Infinity;
          this.movingShape.inputpoint.forEach((point) => {
            minX = Math.min(minX, point[0]);
            minY = Math.min(minY, point[1]);
            maxX = Math.max(maxX, point[0]);
            maxY = Math.max(maxY, point[1]);
          });

          this.ctx.strokeRect(
            minX - padding,
            minY - padding,
            maxX  - minX,
            maxY - minY
          )
        this.freeDraw(this.movingShape.inputpoint);
      }
    }
    this.existingShape.forEach((shape) => {
      this.ctx.strokeStyle = "white";
      if (shape.type === "ract") {
        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === "circle") {
        this.ctx.beginPath();
        this.ctx.arc(
          shape.centerX,
          shape.centerY,
          Math.abs(Number(shape.radius)),
          0,
          2 * Math.PI
        );
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (shape.type === "line") {
        this.ctx.beginPath();
        this.ctx.strokeStyle = "white";
        this.ctx.moveTo(shape.x1, shape.y1);
        this.ctx.lineTo(shape.x2, shape.y2);
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (shape.type === "pen") {
        this.freeDraw(shape.inputpoint); // Freehand pen stays using ctx
      }
    });
  }

  isWithElement(shape: shape) {
    if (shape.type === "ract") {
      return (
        this.StartX > shape.x &&
        this.StartX < shape.x + shape.width &&
        this.StartY > shape.y &&
        this.StartY < shape.y + shape.height
      );
    }
    if (shape.type === "line") {
      const a = { x: shape.x1, y: shape.y1 };
      const b = { x: shape.x2, y: shape.y2 };
      const c = { x: this.StartX, y: this.StartY };
      const offset =
        this.distance(a, b) - (this.distance(a, c) + this.distance(b, c));
      return Math.abs(offset) < 1;
    }
    if (shape.type === "circle") {
      return (
        this.distance(
          { x: shape.centerX, y: shape.centerY },
          { x: this.StartX, y: this.StartY }
        ) < Math.abs(Number(shape.radius))
      );
    }
    if (shape.type === "pen") {
      // Need at least 2 points to form a line
      if (shape.inputpoint.length < 2) return false;

      const threshold = 5; // How close (in pixels) the click needs to be to the line

      // Check each line segment
      for (let i = 0; i < shape.inputpoint.length - 1; i++) {
        const p1 = shape.inputpoint[i];
        const p2 = shape.inputpoint[i + 1];

        // Check if point is near the line segment
        if (
          this.isPointNearLine(
            { x: this.StartX, y: this.StartY },
            { x: p1[0], y: p1[1] },
            { x: p2[0], y: p2[1] },
            threshold
          )
        ) {
          return true;
        }
      }
      return false;
    }
  }

  private isPointNearLine(
    point: Point,
    lineStart: Point,
    lineEnd: Point,
    threshold: number
  ): boolean {
    // Line length
    const lineLength = this.distance(lineStart, lineEnd);

    // Distance from point to line start and end
    const d1 = this.distance(point, lineStart);
    const d2 = this.distance(point, lineEnd);

    // If point is very close to either end point
    if (d1 < threshold || d2 < threshold) return true;

    // If line is very short, just check distance to midpoint
    if (lineLength < threshold) {
      const midX = (lineStart.x + lineEnd.x) / 2;
      const midY = (lineStart.y + lineEnd.y) / 2;
      return this.distance(point, { x: midX, y: midY }) < threshold;
    }

    // Calculate projection distance
    const u =
      ((point.x - lineStart.x) * (lineEnd.x - lineStart.x) +
        (point.y - lineStart.y) * (lineEnd.y - lineStart.y)) /
      (lineLength * lineLength);

    // If projection is outside the segment, return false
    if (u < 0 || u > 1) return false;

    // Calculate projected point
    const px = lineStart.x + u * (lineEnd.x - lineStart.x);
    const py = lineStart.y + u * (lineEnd.y - lineStart.y);

    // Check distance to projected point
    return this.distance(point, { x: px, y: py }) < threshold;
  }

  distance = (a: Point, b: Point) =>
    Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  getElementAtPosition() {
    return this.existingShape.find((shape) => this.isWithElement(shape));
  }

  freeDraw(inputpoint: number[][]) {
    if (inputpoint.length < 2) return;

    this.ctx.beginPath();
    this.ctx.strokeStyle = "white";
    this.ctx.moveTo(inputpoint[0][0], inputpoint[0][1]);

    for (let i = 1; i < inputpoint.length; i++) {
      this.ctx.lineTo(inputpoint[i][0], inputpoint[i][1]);
    }
    this.ctx.stroke();
    this.ctx.closePath();
  }

  mouseDownHandler = (e: MouseEvent) => {
    this.StartX = e.clientX;
    this.StartY = e.clientY;
    if (this.selectedTool === Tools.SELECTION) {
      const ele = this.getElementAtPosition();
      if (ele) {
        this.movingShape = ele;
        this.moving = true;
      }
    } else {
      this.clicked = true;
      if (this.selectedTool === Tools.PEN) {
        this.inputpoint = [];
        this.inputpoint.push([this.StartX, this.StartY]);
      }
    }
  };

  mouseMoveHandler = (e: MouseEvent) => {
    this.width = e.clientX - this.StartX;
    this.height = e.clientY - this.StartY;
    if (this.moving) {
      (e.target as HTMLElement).style.cursor = "move";
      if (this.movingShape?.type === "ract") {
        this.existingShape = this.existingShape.filter(
          (shape) => shape !== this.movingShape
        );
        this.clearCanvas();
        const deltaX = e.clientX - this.StartX;
        const deltaY = e.clientY - this.StartY;
        this.movingShape.x += deltaX;
        this.movingShape.y += deltaY;
        this.StartX = e.clientX;
        this.StartY = e.clientY;
      }
      if (this.movingShape?.type === "circle") {
        this.existingShape = this.existingShape.filter(
          (shape) => shape !== this.movingShape
        );
        this.clearCanvas();
        const deltaX = e.clientX - this.StartX;
        const deltaY = e.clientY - this.StartY;
        this.movingShape.centerX += deltaX;
        this.movingShape.centerY += deltaY;
        this.StartX = e.clientX;
        this.StartY = e.clientY;
      }
      if (this.movingShape?.type === "line") {
        this.existingShape = this.existingShape.filter(
          (shape) => shape !== this.movingShape
        );
        this.clearCanvas();
        const deltaX = e.clientX - this.StartX;
        const deltaY = e.clientY - this.StartY;
        this.movingShape.x1 += deltaX;
        this.movingShape.x2 += deltaX;
        this.movingShape.y1 += deltaY;
        this.movingShape.y2 += deltaY;
        this.StartX = e.clientX;
        this.StartY = e.clientY;
      }
      if (this.movingShape?.type === "pen") {
        console.log(this.movingShape);
        this.existingShape = this.existingShape.filter(
          (shape) => shape !== this.movingShape
        );
        this.clearCanvas();
        const deltaX = e.clientX - this.StartX;
        const deltaY = e.clientY - this.StartY;
        this.movingShape.inputpoint = this.movingShape.inputpoint.map(
          (point) => [point[0] + deltaX, point[1] + deltaY]
        );
        console.log(this.movingShape.inputpoint);
        this.StartX = e.clientX;
        this.StartY = e.clientY;
      }
    }
    if (this.clicked) {
      this.width = e.clientX - this.StartX;
      this.height = e.clientY - this.StartY;
      this.clearCanvas();
      this.ctx.strokeStyle = "white";
      if (this.selectedTool === Tools.SQUARE) {
        this.ctx.strokeRect(this.StartX, this.StartY, this.width, this.height);
      } else if (this.selectedTool === Tools.CIRCLE) {
        this.centerX = this.StartX + this.width / 2;
        this.centerY = this.StartY + this.width / 2;
        this.radius = Math.max(this.width, this.height) / 2;
        this.ctx.beginPath();
        this.ctx.arc(
          this.centerX,
          this.centerY,
          Math.abs(this.radius),
          0,
          2 * Math.PI
        );
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (this.selectedTool === Tools.PEN) {
        this.inputpoint.push([e.clientX, e.clientY]);
        this.freeDraw(this.inputpoint);
      } else if (this.selectedTool === Tools.Line) {
        this.ctx.strokeStyle = "white";
        this.ctx.beginPath();
        this.ctx.moveTo(this.StartX, this.StartY);
        this.ctx.lineTo(e.clientX, e.clientY);
        this.ctx.stroke();
        this.ctx.closePath();
      } else {
        return;
      }
    }
  };

  mouseUpHandler = (e: MouseEvent) => {
    if (this.moving && this.movingShape !== null) {
      (e.target as HTMLElement).style.cursor = "default";

      if (this.movingShape.type === "ract") {
        this.socket.send(
          JSON.stringify({
            type: "updateChat",
            message: JSON.stringify({
              id: this.movingShape.id,
              shape: {
                type: this.movingShape.type,
                x: this.movingShape.x,
                y: this.movingShape.y,
                width: this.movingShape.width,
                height: this.movingShape.height,
              },
            }),
            roomId: this.roomId,
          })
        );
      }
      if (this.movingShape.type === "circle") {
        this.socket.send(
          JSON.stringify({
            type: "updateChat",
            message: JSON.stringify({
              id: this.movingShape.id,
              shape: {
                type: this.movingShape.type,
                centerX: this.movingShape.centerX,
                centerY: this.movingShape.centerY,
                radius: this.movingShape.radius,
              },
            }),
            roomId: this.roomId,
          })
        );
      }
      if (this.movingShape.type === "line") {
        console.log(this.movingShape);
        this.socket.send(
          JSON.stringify({
            type: "updateChat",
            message: JSON.stringify({
              id: this.movingShape.id,
              shape: {
                type: this.movingShape.type,
                x1: this.movingShape.x1,
                y1: this.movingShape.y1,
                x2: this.movingShape.x2,
                y2: this.movingShape.y2,
              },
            }),
            roomId: this.roomId,
          })
        );
      }
      if (this.movingShape.type === "pen") {
        this.socket.send(
          JSON.stringify({
            type: "updateChat",
            message: JSON.stringify({
              id: this.movingShape.id,
              shape: {
                type: this.movingShape.type,
                inputpoint: this.movingShape.inputpoint,
              },
            }),
            roomId: this.roomId,
          })
        );
      }
      this.moving = false;
      this.existingShape = this.existingShape.filter(
        (shape) => shape.id !== this.movingShape?.id
      );
      this.existingShape.push(this.movingShape);
      this.movingShape = null;
      this.clearCanvas();
    }
    this.clicked = false;
    if (this.selectedTool === Tools.SQUARE) {
      this.existingShape.push({
        type: "ract",
        x: this.StartX,
        y: this.StartY,
        width: this.width,
        height: this.height,
      });
      this.figure = {
        type: "ract",
        x: this.StartX,
        y: this.StartY,
        width: this.width,
        height: this.height,
      };
    } else if (this.selectedTool === Tools.CIRCLE) {
      this.existingShape.push({
        type: "circle",
        centerX: this.centerX,
        centerY: this.centerY,
        radius: Math.abs(this.radius),
      });
      this.figure = {
        type: "circle",
        centerX: this.centerX,
        centerY: this.centerY,
        radius: Math.abs(this.radius),
      };
    } else if (this.selectedTool === Tools.PEN) {
      this.figure = {
        type: "pen",
        inputpoint: this.inputpoint,
      };
      this.existingShape.push(this.figure);
    } else if (this.selectedTool === Tools.Line) {
      this.figure = {
        type: "line",
        x1: this.StartX,
        y1: this.StartY,
        x2: e.clientX,
        y2: e.clientY,
      };
      this.existingShape.push(this.figure);
    } else {
      return;
    }
    this.socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify(this.figure),
        roomId: this.roomId,
      })
    );
    this.clearCanvas();
  };

  doubleClickHandler = (e: MouseEvent) => {
    
  }
  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("dblclick", this.doubleClickHandler);
  }
}
