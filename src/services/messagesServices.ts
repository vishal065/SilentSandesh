import { ApiResponse } from "@/types/ApiResponse";
import axios from "axios";

class messageService {
  // ------------------ check user accept message ----------------

  isAcceptMessages = () => axios.get<ApiResponse>("/api/accept-messages");

  // ------------------ check switch accept message ----------------
  switchAcceptMessages = (data: { acceptMessages: boolean }) =>
    axios.post<ApiResponse>(`/api/accept-messages`, data);

  // ------------------ get all messages ----------------
  getAllMessages = () => axios.get<ApiResponse>(`/api/get-messages`);

  // ------------------ send message ----------------
  sendMessages = async (message: { username: string; content: string }) =>
    await axios.post<ApiResponse>(`/api/send-message`, message);

  // ------------------ delete message ----------------
  deleteMessage = (messageId: { messageId: string }) =>
    axios.delete<ApiResponse>(`/api/delete-message/${messageId}`);
}

const messageServices = new messageService();

export default messageServices;
