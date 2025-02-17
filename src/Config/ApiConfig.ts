import Axios from "axios";
export const BaseUrl = "http://localhost:8080";
export const Api = Axios.create({
  baseURL: BaseUrl,
});
