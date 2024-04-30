"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useChat } from "ai/react";
import { useState } from "react";

export function Chat() {
  const [input, setInput] = useState('');
  const [responses, setResponses] = useState<{ role: string; content: any }[]>([]);
  const [msg, setMsg] = useState("");
  const [fileUrl, setFileUrl] = useState<string>("");
  const [isFileUploaded, setIsFileUploaded] = useState<boolean>(false);

  const handleInputChange = (event : React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  async function handleUpload() {
    if (fileUrl && !isFileUploaded) {
      setMsg("Uploading...");

      const responseToBlob = await fetch(fileUrl);
      const blob = await responseToBlob.blob();
      const arrayBuffer = await new Response(blob).arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      const response = await fetch("/api/pdf-extractor", {
        method: "POST",
        body: JSON.stringify({ data: Array.from(uint8Array) }), // Convert the Uint8Array to a regular array
        headers: {
          "Content-Type": "application/json",
          "req-type": "fileUpload",
        },
      });

      if (response.ok) {
        setIsFileUploaded(true);
        setMsg("File uploaded successfully ");
      } else {
        setMsg("Error while uploading file");
        console.log("Error:", response.status);
      }
    } else {
      console.log("No file selected");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isFileUploaded) return; // Check if file is uploaded
  
    const payload = {
      messages: [
        ...responses, // Include message history
        { role: "user", content: input }, // Include user's message
      ],
    };

    setResponses((prevResponses) => [
      ...prevResponses,
      { role: "user", content: input },
    ]);

    try {
      setMsg("Sending message...");
      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Response from backend is fetched");
        setResponses((prevResponses) => [
          ...prevResponses,
          { role: "system", content: result },
        ]);
        setInput("");
        setMsg("");
        console.log(responses);
      } else {
        setMsg("Error sending message ");
        console.log("Error:", response.status);
      }
    } catch (error) {
      console.error("Error sending message before sending backend:", error);
      setMsg("Error sending message");
    }
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const selectedPdf = files[0];
      setFileUrl(URL.createObjectURL(selectedPdf));
    }
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
          <p className="text-lg font-semibold text-center">
            Welcome to the PDF CHAT, please add your PDF file.
          </p>
          <div className="grid gap-1.5">
            <Label className="leading-none" htmlFor="upload">
              Select a PDF to upload
            </Label>
            <Input
              accept=".pdf"
              id="upload"
              type="file"
              onChange={handleFileChange}
            />
            <Button disabled={!fileUrl} type="button" onClick={handleUpload}>
              Upload
            </Button>
            {msg && <span>{msg}</span>}
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label className="leading-none" htmlFor="conversation">
              Conversation
            </Label>
            <div className="border p-4 rounded-lg h-48 overflow-y-auto">
              {responses.map((message, index) => (
                <p key={index}>{message.content}</p>
              ))}
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label className="leading-none" htmlFor="message">
              Type your message
            </Label>
            <Textarea
              id="message"
              onChange={handleInputChange}
              placeholder="Type your message"
              value={input}
              disabled={!isFileUploaded}
            />
          </div>
          <form onSubmit={handleSubmit}>
            <Button type="submit" disabled={!isFileUploaded}>
              Send
            </Button>{" "}
          </form>
        </div>
      </div>
    </div>
  );
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
  );
}
