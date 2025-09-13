// 动态用户数据获取函数 - 每次调用时实时获取
import { GetUserData } from "@/utils";

// 根据环境变量或当前URL确定API基础URL
const getApiBaseUrl = () => {
  // 如果设置了环境变量，使用环境变量
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // 否则根据当前域名判断
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // 开发环境：直接连接到后端容器
    return "http://localhost:8000/api/v1/";
  } else {
    // 生产环境：使用相对路径，通过nginx代理
    return "/api/v1/";
  }
};

// 静态常量 - 不依赖于用户状态
export const API_BASE_URL = getApiBaseUrl();
export const PAYPAL_CLIENT_ID =
  "AY-uavR7TG2vQlu0RXV9GFIs0mhQlKzOrLVIb6VpYu6Ar9Cmjy_reVRBJWIJDeNmiVVYf0Nzx68_j42m";

export const getCurrentUserId = () => GetUserData()?.user_id;
export const getCurrentTeacherId = () => GetUserData()?.teacher_id;
