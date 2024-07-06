import { RAGChat, openaiModel } from '@upstash/rag-chat'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const UPSTASH_VECTOR_REST_URL = process.env.UPSTASH_VECTOR_REST_URL
const UPSTASH_VECTOR_REST_TOKEN = process.env.UPSTASH_VECTOR_REST_TOKEN

export const ragChat = new RAGChat({
    model: openaiModel("gpt-4-turbo")
})
