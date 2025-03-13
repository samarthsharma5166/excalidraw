import { HTTP_BACKEND_URL } from "@/config";
import axios from "axios";

export async function getExistingShape(roomId: string) {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${HTTP_BACKEND_URL}/chat/${roomId}`, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
  const data = res.data.messages;
  const shapes = await data.map((x: { success: boolean; message: string }) => {
    const messageData = JSON.parse(x.message);
    return messageData;
  });
  return shapes;
}
