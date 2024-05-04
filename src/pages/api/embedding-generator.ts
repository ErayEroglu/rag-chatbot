import OpenAI from "openai";
import { Index } from "@upstash/vector";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const index = new Index({
    url: process.env.UPSTASH_VECTOR_REST_URL,
    token: process.env.UPSTASH_VECTOR_REST_TOKEN,
  });

async function getChunksFromPDF(text: string) {
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });
    const chunks = await textSplitter.splitText(text);
    return chunks;
}

async function generateEmbedding(text: string) {
    const response = await openai.embeddings.create({
        model: 'text-embedding-3-large',
        input: text,
        dimensions: 256,
    });

    if (response.data && response.data.length > 0 && response.data[0].embedding) {
        return response.data[0].embedding;
    } else {
        throw new Error('No embeddings found');
    }
}

export async function uploadEmbeddings(text : string, vectorDB : Index) {
    const chunks = await getChunksFromPDF(text);
    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const embedding = await generateEmbedding(chunk);
        await vectorDB.upsert({
            id: `${i}`,
            vector: embedding,
            metadata: { text: chunk }
        });
    }
}

async function createQuery(question : string, maxK : number, vectorDB : Index) {
    const embedding = await generateEmbedding(question);
    try {
        const results = await vectorDB.query({
            vector: embedding,
            topK: maxK,
            includeMetadata: true,
        });
    return results;
    } catch (e) {
        console.error(e);
    }
}

export async function generateResults(vectorDB : Index, messageHistory: { role: "system" | "user" , content: string }[], length: number) {
    const query = messageHistory.filter(message => message.role === 'user').slice(-3).map(message => message.content).join('\n');
    const results = await createQuery(query,3,vectorDB);
    const chatCompletion = await openai.chat.completions.create({
        messages: [
            ...messageHistory,
            {
                role: 'user',
                content: `Generate an answer for the following prompt: ${messageHistory[length-1].content} \n
                by using the following information : ${JSON.stringify(results)}. `,
            },
        ],
        model: 'gpt-3.5-turbo', 
    });
    return chatCompletion.choices[0].message.content;
}