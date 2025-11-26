import axios from "axios";

export const api = axios.create({
  baseURL: "https://studentbackend-snw0.onrender.com"
});
