'use client';
import { useEffect, useState } from "react";
import RoomCard from "./components/RoomCard";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Ensure localStorage is accessed only on the client-side
    const token = localStorage.getItem("token");
    setToken(token);

    if (!token) {
      router.push("/sign-in");
    }
  }, [router]);

  if (!token) {
    return null; // or a loading spinner while redirecting
  }

  return (
    <main>
      <RoomCard />
    </main>
  );
}