import { GoogleGenAI, Chat } from "@google/genai";

// Initialize Gemini Client
// Note: process.env.API_KEY is expected to be available in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelName = 'gemini-3-flash-preview';

/**
 * Creates a chat session tailored for a Math Tutor persona.
 */
export const createMathTutorChat = (): Chat => {
  return ai.chats.create({
    model: modelName,
    config: {
      temperature: 0.7,
      systemInstruction: `Bạn là một gia sư Toán học thân thiện, kiên nhẫn và thông thái. 
      Nhiệm vụ của bạn là giúp học sinh hiểu các khái niệm toán học, từ cơ bản đến nâng cao.
      
      Quy tắc:
      1. Giải thích rõ ràng, từng bước một.
      2. Sử dụng tiếng Việt chuẩn.
      3. Nếu học sinh hỏi về hình học không gian, hãy gợi ý họ sử dụng công cụ GeoGebra trên trang web này.
      4. Luôn khuyến khích học sinh tự tư duy trước khi đưa ra đáp án cuối cùng.
      5. Định dạng công thức toán học đẹp mắt (nếu có thể dùng ký hiệu text cơ bản hoặc LaTeX nếu hỗ trợ).`,
    },
  });
};
