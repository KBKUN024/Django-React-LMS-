import { useAuthStore } from "@/store/auth";
import type { AllUserData } from "@/types";
import { apiClient, createAuthenticatedAxios } from "./axios";
import { jwtDecode } from "jwt-decode";
import Cookie from "js-cookie";
import Swal from "sweetalert2";
import Toast from "@/utils/SweetAlert2/Toast";
const authAxios = createAuthenticatedAxios();
export const getCartCount = async (cart_id: string) => {
  const res = await apiClient.get(`/cart/cart-count/${cart_id}`);
  console.log("cart-count res:", res);
  if (res.status == 200) {
    useAuthStore.getState().setCartCount(res.data.count);
  }
};

/**
 * 登录函数
 * @param email
 * @param password
 * @returns
 */
export const login = async (email: string, password: string) => {
  try {
    const { data, status } = await authAxios.post("user/token/", {
      email: email,
      password: password,
    });
    console.log("login data is:", data);
    console.log("login status is:", status);
    if (status == 200) {
      setAuthUser(data.access, data.refresh);
    }
    // let cart_id = localStorage.getItem("cart_id");
    // console.log('在login函数中，cart_id:',cart_id)
    // // 获取一下cart_id，并更新购物车的数量
    // if (cart_id) {
    //   await getCartCount(cart_id);
    // }
    return {
      data,
      error: null,
    };
  } catch (error: unknown) {
    console.log("login error is:", error);
    const axiosError = error as { response?: { data?: { detail?: string } } };
    return {
      data: null,
      error: axiosError.response?.data?.detail || "Something went wrong",
    };
  }
};

/**
 * 用户登出函数
 */
export const logout = (text: string = "You have been logged out") => {
  console.log("执行 logout，清理所有用户数据");
  
  // 1. 清除 Cookie
  Cookie.remove("access_token");
  Cookie.remove("refresh_token");
  
  // 2. 清除 Store 状态 - 确保完整重置
  const store = useAuthStore.getState();
  store.setUser(null);
  store.setProfile(null);  // 修改：传入null而不是空对象
  store.setCartCount(0);
  
  // 3. 强制清除持久化存储，确保 IndexedDB 同步
  try {
    // 使用异步方式清除存储，确保完全清除
    useAuthStore.persist.clearStorage();
    console.log("Zustand persist storage 已清除");
    
    // 额外确保 IndexedDB 清理
    setTimeout(async () => {
      try {
        const { indexedDBStorage } = await import("@/utils/IndexedDBStorage");
        await indexedDBStorage.removeItem("auth-store");
        console.log("IndexedDB auth-store 数据已清除");
      } catch (dbError) {
        console.error("手动清除 IndexedDB 失败:", dbError);
      }
    }, 100);
  } catch (error) {
    console.error("清除持久化存储失败:", error);
  }
  
  Toast.fire({
    text: text,
    icon: "error",
  });
};

/**
 * 用户注册函数
 * @param full_name
 * @param email
 * @param password
 * @param password2
 * @returns
 */
export const register = async (
  full_name: string,
  email: string,
  password: string,
  password2: string
) => {
  try {
    const { data, status } = await authAxios.post("user/register/", {
      full_name: full_name,
      email: email,
      password: password,
      password2: password2,
    });
    console.log("register data is:", data);
    console.log("register status is:", status);
    await login(email, password);
    return {
      data,
      error: null,
    };
  } catch (error: unknown) {
    console.log("register error is:", error);
    const axiosError = error as { response?: { data?: Record<string, unknown> } };
    let html = "<ul>";
    if (axiosError.response?.data) {
      for (const key in axiosError.response.data) {
        if (Array.isArray(axiosError.response.data[key])) {
          html += `<li>${key}<ul>`;
          for (const msg of axiosError.response.data[key]) {
            html += `<li>${msg}</li>`;
          }
          html += "</ul></li>";
        } else {
          html += `<li>${key}: ${axiosError.response.data[key]}</li>`;
        }
      }
    }
    html += "</ul>";

    Swal.fire({
      title: "Registration",
      text: "Registration Failed!",
      icon: "error",
      html: html,
    });
    return {
      data: null,
      error: error || "Something went wrong",
    };
  }
};

export const CheckUser = async () => {
  try {
    const access_token = Cookie.get("access_token");
    const refresh_token = Cookie.get("refresh_token");
    
    console.log("CheckUser - access_token exists:", !!access_token);
    console.log("CheckUser - refresh_token exists:", !!refresh_token);
    
    if (!refresh_token || !access_token) {
      console.log("Tokens do not exist, clearing user state");
      logout("登录状态已过期，请重新登录");
      return false;
    }
    
    // 检查 refresh token 是否过期
    try {
      const decodedRefreshToken = jwtDecode(refresh_token) as { exp: number };
      if (decodedRefreshToken.exp < Date.now() / 1000) {
        console.log("Refresh token expired, logging out");
        logout("登录状态已过期，请重新登录");
        return false;
      }
    } catch (refreshDecodeError) {
      console.error("Failed to decode refresh token:", refreshDecodeError);
      logout("Token 格式错误，请重新登录");
      return false;
    }
    
    // 检查 access token 是否过期
    if (isAccessTokenExpired(access_token)) {
      console.log("Access token expired, attempting refresh...");
      
      try {
        const response = await getRefreshedToken(refresh_token);
        
        if (response.data && response.data.access && response.data.refresh) {
          setAuthUser(response.data.access, response.data.refresh);
          console.log("Token refreshed successfully");
          return true;
        } else {
          console.error("Invalid refresh response:", response.data);
          logout("Token 刷新失败，请重新登录");
          return false;
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // 检查是否是网络错误 vs 认证错误
        const axiosError = refreshError as { response?: { status?: number } };
        if (axiosError.response?.status === 401) {
          logout("登录状态已过期，请重新登录");
        } else {
          console.log("Network error during token refresh, keeping current state");
          // 网络错误时不立即登出，保持当前状态
          return true;
        }
        return false;
      }
    }
    
    // 确保用户数据在store中
    const currentUser = useAuthStore.getState().allUserData;
    if (!currentUser) {
      try {
        const decodedToken = jwtDecode(access_token) as AllUserData;
        if (decodedToken && decodedToken.user_id) {
          useAuthStore.getState().setUser(decodedToken);
          console.log("Restored user data to store from access token");
        }
      } catch (decodeError) {
        console.error("Failed to restore user data:", decodeError);
      }
    }
    
    console.log("Access token is valid");
    return true;
  } catch (error) {
    console.error("CheckUser error:", error);
    logout("用户状态检查失败，请重新登录");
    return false;
  }
};

/**
 * 返回true: 过期了（如果过期时间小于现在的时间，也就是说现在的时间已经超过了规定的过期时间，那么说明已经过期了）；
 *
 * 返回false，没过期（也就是过期时间大于等于现在的时间，换句话来说就是现在的时间还没有超过规定的过期时间，那么就是没有过期）
 * @param access_token
 * @returns
 */
export const isAccessTokenExpired = (access_token: string) => {
  try {
    // 检查 token 是否为空或格式不正确
    if (!access_token || typeof access_token !== 'string' || access_token.trim() === '') {
      console.warn("Access token is empty or invalid");
      return true;
    }
    
    const decodedToken = jwtDecode(access_token) as { exp: number };
    
    // 检查解码结果是否包含 exp 字段
    if (!decodedToken || typeof decodedToken.exp !== 'number') {
      console.warn("Decoded token missing exp field");
      return true;
    }
    
    const isExpired = decodedToken.exp < Date.now() / 1000;
    console.log(`Token expiration check: ${isExpired ? 'EXPIRED' : 'VALID'}`);
    return isExpired;
  } catch (error) {
    console.error("JWT decode error:", error);
    // JWT 解码失败，认为 token 已过期
    return true;
  }
};

export const getRefreshedToken = async (refresh_token: string) => {
  // 使用基础的 apiClient 避免触发拦截器导致死循环
  const response = await apiClient.post("user/token/refresh/", {
    refresh: refresh_token,
  });
  return response;
};

/**
 * 设置认证用户信息，包括将 access_token 和 refresh_token 存入 Cookie，
 * 并将解码后的用户信息存入全局状态管理（useAuthStore）。
 *
 * @param access_token - 登录后后端返回的 access_token，用于身份验证
 * @param refresh_token - 登录后后端返回的 refresh_token，用于刷新 access_token
 */
export const setAuthUser = (access_token: string, refresh_token: string) => {
  try {
    // 验证 token 格式
    if (!access_token || !refresh_token) {
      console.error("Invalid tokens provided to setAuthUser");
      return;
    }

    // 将 access_token 存入 Cookie，过期时间为 1 天
    // 在开发环境使用 HTTP，生产环境使用 HTTPS
    Cookie.set("access_token", access_token, {
      expires: 1,
      secure: import.meta.env.PROD, // 只在生产环境启用 secure
    });

    // 将 refresh_token 存入 Cookie，过期时间为 50 天（与后端配置保持一致）
    Cookie.set("refresh_token", refresh_token, {
      expires: 50,
      secure: import.meta.env.PROD, // 只在生产环境启用 secure
    });

    // 使用 jwtDecode 解码 access_token，获取用户信息（如 id、用户名、权限等）
    try {
      const decodedToken = jwtDecode(access_token) as AllUserData;
      console.log("decodedToken:", decodedToken);
      
      // 验证解码后的数据
      if (decodedToken && decodedToken.user_id) {
        useAuthStore.getState().setUser(decodedToken);
      } else {
        console.error("Decoded token missing required fields");
        useAuthStore.getState().setUser(null);
      }
    } catch (decodeError) {
      console.error("Failed to decode access token:", decodeError);
      useAuthStore.getState().setUser(null);
    }
  } catch (error) {
    console.error("Error in setAuthUser:", error);
  } finally {
    // 无论是否成功设置用户，都将 loading 状态设为 false，表示用户信息加载完毕
    useAuthStore.getState().setLoading(false);
  }
};
