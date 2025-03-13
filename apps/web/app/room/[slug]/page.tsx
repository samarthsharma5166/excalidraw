import { axiosInstance } from "../../../libs/helper/axiosInstances";
import { ChatRoom } from "../../components/ChatRoom";

async function getRoomId(slug: string) {
    try {
        const res = await axiosInstance.get(`/room/${slug}`);
        console.log(res)
        return res.data.id;
    } catch (error) {
        console.log(error)
    }
}
export default async function Page({ params }: { params: { slug: string } }) {
    const slug = (await params).slug;
    console.log(slug)
    const roomId = await getRoomId(slug);
    console.log(roomId)

    
    return (
        <ChatRoom id={roomId}/>
    )
}