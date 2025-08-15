import { handleFollowUp } from "../service/gemini.service.js";

export const chatController = async (req, res) => {
  console.log(req.body);

  const { userMessage, ROLE } = req.body;

  try {
    const generatedResponse = await handleFollowUp(userMessage, ROLE);
    return res.status(200).json({ generatedResponse, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error, success: false });
  }
};
