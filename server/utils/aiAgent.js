require("dotenv").config();

const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const {
  createStuffDocumentsChain,
} = require("langchain/chains/combine_documents");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { createRetrievalChain } = require("langchain/chains/retrieval");
const { Document } = require("langchain/document");

const CommunityPost = require("../models/CommunityPost");

const path = require("path");

// AI Agent function
async function processCommunityQuery(userInput) {
  // 1. Load documents (e.g., from a text file)
  const posts = await CommunityPost.find();
  const rawDocs = posts.map(
    (post) =>
      new Document({
        pageContent: `${post.title}\n${post.content}`,
        metadata: {
          id: post._id.toString(),
          title: post.title,
          category: post.category,
          createdAt: post.createdAt,
        },
      })
  );

  // 2. Split documents into chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 300,
    chunkOverlap: 50,
  });
  const splitDocs = await splitter.splitDocuments(rawDocs);

  // 3. Create vector store using embeddings
  const embeddings = new GoogleGenerativeAIEmbeddings({
    modelName: "models/embedding-001",
    apiKey: process.env.GOOGLE_API_KEY,
  });
  const vectorStore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings
  );

  // 4. Initialize Gemini model
  const model = new ChatGoogleGenerativeAI({
    model: "models/gemini-1.5-flash-latest",
    apiKey: process.env.GOOGLE_API_KEY,
    temperature: 0.7,
    maxOutputTokens: 1000,
  });

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are a helpful assistant that answers community-related questions based on the following posts.",
    ],
    ["human", "Context:\n{context}\n\nQuestion:\n{input}"],
  ]);

  const combineDocsChain = await createStuffDocumentsChain({
    llm: model,
    prompt,
  });

  const chain = await createRetrievalChain({
    retriever: vectorStore.asRetriever(),
    combineDocsChain,
    returnSourceDocuments: true,
  });

  const result = await chain.invoke({ input: userInput });

  const retrievedIds = result.context?.map((doc) => doc.metadata.id);
  const retrievedPosts = await CommunityPost.find({
    _id: { $in: retrievedIds },
  });

  const followupPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "Based on the assistant's answer, generate 3 short, helpful follow-up questions a user might ask next. Reply with just the questions, each on a new line.",
    ],
    ["human", "{answer}"],
  ]);

  const followupMessages = await followupPrompt.formatMessages({
    answer: result.answer || result.text || "No response.",
  });
  const followupResult = await model.invoke(followupMessages);

  const followupText =
    typeof followupResult === "string"
      ? followupResult
      : followupResult?.content || followupResult?.text || "";

  const suggestedQuestions = followupText
    .split(/\n+/)
    .map((q) => q.replace(/^\d+[\).\s]*/, "").trim())
    .filter((q) => q.length > 0);

  // 8. Suggested follow-up questions
  return {
    text: result.answer || result.text || "No response.",
    suggestedQuestions,
    retrievedPosts,
  };
}

module.exports = { processCommunityQuery };
