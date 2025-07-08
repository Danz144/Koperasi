import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true,
});

export const login = (username, password) =>
  API.post("/login", { username, password });

export const logout = (token) =>
  API.post("/logout", {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
