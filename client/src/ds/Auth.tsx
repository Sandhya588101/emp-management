
import api from "../api/api";

export const signIn = (data: any) =>
  api.post("/auth/login", data);

export const signUp = (data: any) =>
  api.post("/auth/register", data);

export const getCurrentUser = () =>
  api.get("/auth/me");
