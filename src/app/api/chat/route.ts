import { generateResults, index} from '@/pages/api/embedding-generator';

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    console.log("Request received");
    const body = await req.json();
    const messages = body.messages;
    const length = messages.length;
    const results = await generateResults(index, messages, length); 
    return new Response(JSON.stringify(results), { status: 200 });
  } catch (error) {
    console.error("OpeanAI API error :", error);
    return new Response("OpeanAI API error", { status: 500 });
  }
}
