import axios from "axios";
import { server_api } from "../config/env.config";
import { demoApiAdapter } from "./demo.api";
import { isDemoMode } from "../config/demo.config";

const api = axios.create({
  baseURL: server_api,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  ...(isDemoMode ? { adapter: demoApiAdapter } : {}),
});
export default api;
