import OpenAI from "openai";
import { Index } from "@upstash/vector";
import { getChunkedDocsFromPDF } from "./pdf-splitter";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const index = new Index({
    url: process.env.UPSTASH_VECTOR_REST_URL,
    token: process.env.UPSTASH_VECTOR_REST_TOKEN,
});

async function generateEmbeddings(text: string) {
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

async function uploadEmbeddings(file : File) {
    const chunks = await getChunkedDocsFromPDF(file);
    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const embeddings = await generateEmbeddings(chunks[i].pageContent);
        await index.upsert({
            id: `${i}`,
            vector: embeddings,
            metadata: { text: chunks[i].pageContent }
        });
    }
}

async function createQuery(file : File, maxK : any) {
    const embeddings = await uploadEmbeddings(file);
    try {
        const query = {
            vector: embeddings,
            k: maxK,
            includeMetadata: true,
        };
    return query;
    } catch (e) {
        throw new Error('Error creating query');
    }
}

async function generateResults(query: any) {
    const results = await createQuery(query,3)
    console.log(`Query : ${query} results : ${JSON.stringify(results)}`);
    const chatCompletion = await openai.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: 'You are a RAG Chatbot. Respond to the query with the most relevant information from the top results.',
            },
        ],
        model: 'text-davinci-003', 
    });
}

