import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export const runtime = "edge";

export async function POST(req: Request) {
  try {
    if (req.headers.get("req-type") === "fileUpload")  {
      const formData = await req.formData();
      if (formData.has("file")) {
        const file = formData.get("file");
        return new Response("File uploaded successfully", { status: 200 });
      } else {
        return new Response("No file uploaded", { status: 400 });
      }
    } else {
      const body = await req.json();
      const messages = body.messages;
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        stream: true,
        messages,
      });
      const stream = OpenAIStream(response);
      return new StreamingTextResponse(stream);
    }
  } catch (error) {
    console.error("Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
