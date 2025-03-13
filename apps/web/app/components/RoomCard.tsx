import { Button } from "@repo/ui/button"
import { useRouter } from "next/navigation";
import { useState } from "react"

const RoomCard = () => {
  const[roomId,setRoomId] = useState("");
  const router = useRouter();
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#4b6584] shadow">
      <div className="flex flex-col items-center justify-center min-w-1/3 bg-white shadow p-2 rounded-xl">
        <h1 className="text-2xl font-bold p-4">Create Room</h1>
        <input type="text"  onChange={(e)=>setRoomId(e.target.value)} placeholder="Enter room name" className="px-4 py-2 w-full bg-gray-100 text-gray-800 outline-none rounded-md" />
        <Button onclick={() => router.push(`/room/${roomId}`)} className="mt-4 bg-black text-white p-2 rounded-md hover:bg-gray-800 transition duration-200" appName="web" children={"Join Room"}  />
      </div>
    </div>
  )
}

export default RoomCard