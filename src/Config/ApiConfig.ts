import Axios from "axios";
export const BaseUrl = "https://chat-room-spring-boot-backend.onrender.com";
export const Api = Axios.create({
  baseURL: BaseUrl,
});
