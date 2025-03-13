import { axiosInstance } from "../../libs/helper/axiosInstances"
import { ChatRoomClient } from "./ChatRoomClient";

async function getChat(roomId:string){
    const res = await axiosInstance.get(`/chat/${roomId}`)
    return res.data.chat.messages
}
export async function ChatRoom( {id} : {id:string}) {
    const messages = await getChat(id);
    return (
        <div>
            <ChatRoomClient messages={messages} id={id}/>
        </div>
    )
}