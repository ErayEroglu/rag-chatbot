'use client'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useState } from "react";

export function Chat() {
  const [conversation, setConversation] = useState<string[]>([]);
  const [messageInput, setMessageInput] = useState<string>('');

  const handleMessageSend = () => {
    if (messageInput.trim() !== '') {
      setConversation(prevConversation => [...prevConversation, `User:\n`, messageInput]);
      setMessageInput('');
    }
  };

  // Function to send system messages
  const sendSystemMessage = (message: string) => {
    setConversation(prevConversation => [...prevConversation, message]);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="grid w-full max-w-3xl px-4 gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <TextIcon className="w-8 h-8" />
            <h1 className="text-2xl font-bold tracking-tighter">PDF Chat</h1>
          </div>
        </div>
        <div className="grid gap-4">
          <p className="text-lg font-semibold text-center">Welcome to the PDF CHAT, please add your PDF file.</p>
          <div className="grid gap-1.5">
            <Label className="leading-none" htmlFor="upload">
              Select a PDF to upload
            </Label>
            <Input accept=".pdf" id="upload" type="file" />
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label className="leading-none" htmlFor="conversation">
              Conversation
            </Label>
            <div className="border p-4 rounded-lg h-48 overflow-y-auto">
              {conversation.map((message, index) => (
                <p key={index}>{message}</p>
              ))}
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label className="leading-none" htmlFor="message">
              Type your message
            </Label>
            <Textarea
              id="message"
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type your message"
              value={messageInput}
            />
          </div>
          <Button onClick={handleMessageSend}>Send</Button>
        </div>
      </div>
    </div>
  )
}

function TextIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 6.1H3" />
      <path d="M21 12.1H3" />
      <path d="M15.1 18H3" />
    </svg>
  )
}
