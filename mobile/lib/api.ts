import axios from "axios";
import { useAuth } from "@clerk/clerk-expo";
import { useEffect } from "react";

const API_URL = "https://nex-buy-1.onrender.com/api"

const api = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
    },
});

export const useApi = () => {
  const {getToken} = useAuth();

  useEffect(() => {
    const interceptor = api.interceptors.request.use(async (config) => {
      const  token = await getToken();

      if(token){
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });
    
    // Cleanup
    return () => {
      api.interceptors.request.eject(interceptor);
    }
  }, []);

  return api;
};