import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
 
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export const runtime = 'edge';
 
// export async function POST(req: Request) {
//   const { messages, pdfFile} = await req.json();
//   console.log(messages, pdfFile);
//   //const chunkedDocs = await getChunkedDocsFromPDF(pdfFile);
//   const response = await openai.chat.completions.create({
//     model: 'gpt-3.5-turbo',
//     stream: true,
//     messages,
//   });
 
//   const stream = OpenAIStream(response);
//   return new StreamingTextResponse(stream);
// }


export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    if (formData.has("file")) {
      const file = formData.get("file");
      console.log("File:", file);
      return new Response("File uploaded successfully", { status: 200 });
    } else {
      const messages = await req.json();
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
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