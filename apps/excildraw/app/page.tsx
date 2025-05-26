"use client"
import Image from "next/image";
import "./globals.css";
import { motion } from 'framer-motion';
export default function page() {
  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col items-center justify-center px-6">
      <header className="w-full max-w-6xl flex justify-between items-center py-6">
        <h1 className="text-3xl font-bold text-[#FFD700]">BlipX</h1>
        <nav>
          <ul className="flex space-x-6">
            <li><a href="#features" className="text-gray-300 hover:text-[#FFD700] transition">Features</a></li>
            <li><a href="#about" className="text-gray-300 hover:text-[#FFD700] transition">About</a></li>
            <li><a href="#contact" className="text-gray-300 hover:text-[#FFD700] transition">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main className="flex flex-col items-center text-center py-12">
        <motion.h2
          className="text-5xl font-bold leading-tight max-w-3xl"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Seamless Chat & Whiteboarding for Teams
        </motion.h2>
        <motion.p
          className="text-lg text-gray-400 mt-4 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          Collaborate effortlessly with real-time chat and an interactive whiteboard in one powerful platform.
        </motion.p>
        <motion.a
          href="#features"
          className="mt-6 bg-[#FFD700] text-black py-3 px-6 rounded-full text-lg shadow-md hover:bg-[#FFC700] transition-all"
          whileHover={{ scale: 1.05 }}
        >
          Draw Now
        </motion.a>
      </main>

      <section id="features" className="py-16 max-w-6xl w-full">
        <h3 className="text-4xl font-semibold text-center">Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {[
            { title: "Real-time Chat", desc: "Communicate instantly with your team using channel-based messaging and file sharing." },
            { title: "Integrated Whiteboard", desc: "Visualize ideas with a powerful, interactive whiteboard powered by Excalidraw." },
            { title: "Instant Collaboration", desc: "Stay synced with WebSockets for seamless real-time updates." }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 bg-[#1A1A1A] shadow-lg rounded-xl text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <h4 className="text-xl font-semibold text-[#FFD700]">{feature.title}</h4>
              <p className="text-gray-400 mt-2">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
          <h1 className='text-3xl font-bold text-[#FFD700]  mt-6   '>samarth sharam</h1>
      <footer className="w-full max-w-6xl text-center py-6 border-t border-gray-700 mt-16">
        <p className="text-gray-500">&copy; 2025 BlipX. All rights reserved.</p>
      </footer>
    </div>
  );
}


