import axios from "axios";
import { API_BASE_URL } from "./constants";
import Cookie from "js-cookie";
import {
  isAccessTokenExpired,
  getRefreshedToken,
  setAuthUser,
  logout,
} from "./auth";
// 基础 axios 实例（用于登录、注册等不需要认证的请求）
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 全局变量跟踪token刷新状态
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// 认证 axios 实例（用于需要认证的请求）
export const createAuthenticatedAxios = () => {
  const accessToken = Cookie.get("access_token");

  const authAxios = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
  });

  // 添加请求拦截器处理 token 刷新
  authAxios.interceptors.request.use(
    async (config) => {
      const accessToken = Cookie.get("access_token");
      const refreshToken = Cookie.get("refresh_token");
      console.log("config:", config);
      if (accessToken && refreshToken) {
        // 检查 token 是否过期
        if (isAccessTokenExpired(accessToken)) {
          // 如果已经在刷新，将请求加入队列
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                config.headers.Authorization = `Bearer ${token}`;
                return config;
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          isRefreshing = true;

          try {
            const response = await getRefreshedToken(refreshToken);
            const newAccessToken = response.data.access;
            setAuthUser(newAccessToken, response.data.refresh);
            config.headers.Authorization = `Bearer ${newAccessToken}`;
            processQueue(null, newAccessToken);
            return config;
          } catch (error) {
            processQueue(error, null);
            // Token 刷新失败，清除认证信息
            Cookie.remove("access_token");
            Cookie.remove("refresh_token");
            logout();
            // 重定向到登录页面
            if (window.location.pathname !== "/login/") {
              window.location.href = "/login/";
            }
            return Promise.reject(error);
          } finally {
            isRefreshing = false;
          }
        } else {
          // Token 有效，直接设置
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return authAxios;
};
