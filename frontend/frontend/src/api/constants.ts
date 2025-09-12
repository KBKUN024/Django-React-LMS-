// 动态用户数据获取函数 - 每次调用时实时获取
import { GetUserData } from "@/utils";
// 静态常量 - 不依赖于用户状态
export const API_BASE_URL = "/api/v1/";
export const PAYPAL_CLIENT_ID =
  "AY-uavR7TG2vQlu0RXV9GFIs0mhQlKzOrLVIb6VpYu6Ar9Cmjy_reVRBJWIJDeNmiVVYf0Nzx68_j42m";

export const getCurrentUserId = () => GetUserData()?.user_id;
export const getCurrentTeacherId = () => GetUserData()?.teacher_id;
