import { OpenAI } from "openai";
import { generateResults, index} from '@/pages/api/embedding-generator';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    console.log("Request received");
    const body = await req.json();
    const messages = body.messages[0].content;
    const results = await generateResults(messages, index); 
    console.log("Results:", results);
    return new Response(JSON.stringify(results), { status: 200 });
  } catch (error) {
    console.error("OpeanAI API error :", error);
    return new Response("OpeanAI API error", { status: 500 });
  }
}
