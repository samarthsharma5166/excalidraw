import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import {prisma} from "@repo/db/prisma"

const wss = new WebSocketServer({ port: 8080 });

function checkUser(token: string): string | null {
  try {
    const decode = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (!decode?.id) {
      return null;
    }
    console.log(decode.id);
    return decode.id;
  } catch (e) {
    return null;
  }
}

interface User {
  ws: WebSocket;
  userId: string;
  rooms: string[];
}

const users: User[] = [];

wss.on("connection", (ws, request) => {
  const url = request.url;
  if (!url) {
    ws.close();
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1] || "");
  const token = queryParams.get("token");
  if (!token) {
    ws.close();
    return;
  }

  const id = checkUser(token);
  console.log(id);

  if (!id) {
    ws.close();
    return;
  }

  const user: User = {
    userId: id,
    ws,
    rooms: [],
  };
  users.push(user);

  ws.on("message", async function message(data) {
    try {
      // console.log(JSON.stringify(data));
    // @ts-ignore
      const parsedData = JSON.parse((data));
      console.log(parsedData);

      if (parsedData.type === "join_room") {
        const room = parsedData.roomId;
        const user = users.find((u) => u.ws === ws);
        if (user && !user.rooms.includes(room)) {
          user.rooms.push(room);
          console.log(`User ${user.userId} joined room ${room}`);
        }
      }

      if (parsedData.type === "leave_room") {
        const room = parsedData.roomId;
        const user = users.find((u) => u.ws === ws);
        if (user) {
          user.rooms = user.rooms.filter((r) => r !== room);
          console.log(`User ${user.userId} left room ${room}`);
        }
      }

      if (parsedData.type === "chat") {
        const roomId = (parsedData.roomId);
        const mess = parsedData.message;

        if (!roomId || !mess) {
          console.error("Missing roomId or message in chat event");
          return;
        }
        const id = Number(roomId);
        const res = await prisma.chat.create({
          data:{
            roomId:id,
            message:mess,
            userId:user.userId
          }
        })

        const sender = users.find((u) => u.ws === ws);
        if (!sender || !sender.rooms.includes(roomId)) {
          console.error(`User ${sender?.userId} is not in room ${roomId}`);
          return;
        }

        console.log(`Broadcasting message to room ${roomId}: ${mess}`);


        users.forEach((u) => {
          if (u.rooms.includes(roomId)) {
            u.ws.send(
              JSON.stringify({
                type: "chat",
                message: res,
                roomId,
              })
            );
          }
        });
      }

       if (parsedData.type === "updateChat") {
         const roomId = parsedData.roomId;
         const mess = parsedData.message;

         if (!roomId || !mess) {
           console.error("Missing roomId or message in chat event");
           return;
         }
         const pardata = JSON.parse(mess);
         const id = Number(pardata.id);
         console.log(id);
         console.log("parsed data",pardata);
         console.log("before update", pardata);
         const res = await prisma.chat.update({
           where: {
             id: pardata.id,
           },
           data: {
             message: JSON.stringify(pardata.shape),
           },
         });
         console.log("after update", res);

         users.forEach((u) => {
           if (u.rooms.includes(roomId)) {
             u.ws.send(
               JSON.stringify({
                 type: "updatedChat",
                 message: JSON.stringify(res),
                 roomId,
               })
             );
           }
         });


         console.log("updated chat", res);
       }
    } catch (e) {
      console.error("Error processing message:", e);
    }
  });

  ws.on("close", () => {
    const index = users.findIndex((u) => u.ws === ws);
    if (index !== -1) {
      users.splice(index, 1);
    }
  });
});
