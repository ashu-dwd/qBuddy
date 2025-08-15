import OpenAI from "openai";
import { GEMINI_API_KEY, GEMINI_MODEL_NAME } from "../../config/config.js";
import {
  SYSTEM_PROMPT_HITESH_SIR,
  SYSTEM_PROMPT_PIYUSH_SIR,
} from "../utils/SYSTEM_PROMPT.js";
import ApiError from "../utils/apiError.js";

const openai = new OpenAI({
  apiKey: GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

// In-memory store for each ROLE
const conversationHistories = {
  1: [], // Hitesh Sir
  2: [], // Piyush Sir
};

export const handleFollowUp = async (userMessage, ROLE) => {
  if (!userMessage?.trim()) {
    throw new ApiError(400, "User message cannot be empty");
  }
  if (![1, 2].includes(ROLE)) {
    throw new ApiError(400, "Invalid ROLE. Use 1 or 2.");
  }

  // Select system prompt based on ROLE
  const SYSTEM_PROMPT =
    ROLE === 1 ? SYSTEM_PROMPT_HITESH_SIR : SYSTEM_PROMPT_PIYUSH_SIR;

  // If first message for this role, push system prompt
  if (conversationHistories[ROLE].length === 0) {
    conversationHistories[ROLE].push({
      role: "system",
      content: `${SYSTEM_PROMPT}\n\nAlways end your reply with a short, relevant follow-up question to continue the conversation.`,
    });
  }

  // Add user message
  conversationHistories[ROLE].push({ role: "user", content: userMessage });

  // Call API with full history
  const response = await openai.chat.completions.create({
    model: GEMINI_MODEL_NAME,
    messages: conversationHistories[ROLE],
    max_completion_tokens: 1024,
    temperature: 1.9,
    top_p: 0.8,
    frequency_penalty: 0.5,
    presence_penalty: 0.3,
  });

  const aiReply = response.choices[0]?.message?.content || "";

  // Save AI reply
  conversationHistories[ROLE].push({ role: "assistant", content: aiReply });

  // Return both AI reply and updated history
  return aiReply;
};

// Example:
// (async () => {
//   const res = await handleFollowUp("Hello sir!", 1);
//   console.log(res.reply);
// })();
