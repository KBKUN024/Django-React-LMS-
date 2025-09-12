import { useAuthStore } from "@/store";
import Cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface AuthState {
  cookies: {
    hasAccessToken: boolean;
    hasRefreshToken: boolean;
    accessTokenExpiry: string | null;
    refreshTokenExpiry: string | null;
  };
  store: {
    hasUserData: boolean;
    userId: string | null;
    isLoggedIn: boolean;
    isTeacher: boolean;
  };
  indexedDB: {
    authStoreExists: boolean;
  };
  consistency: {
    allConsistent: boolean;
    issues: string[];
  };
}

/**
 * 调试工具：检查认证状态的一致性
 */
export const debugAuthState = async (): Promise<AuthState> => {
  const issues: string[] = [];

  // 检查 Cookies
  const accessToken = Cookie.get("access_token");
  const refreshToken = Cookie.get("refresh_token");
  const hasAccessToken = !!accessToken;
  const hasRefreshToken = !!refreshToken;

  let accessTokenExpiry: string | null = null;
  let refreshTokenExpiry: string | null = null;

  if (accessToken) {
    try {
      const decoded = jwtDecode(accessToken) as { exp: number };
      accessTokenExpiry = new Date(decoded.exp * 1000).toISOString();
    } catch (error) {
      issues.push("Access token 无法解码");
    }
  }

  if (refreshToken) {
    try {
      const decoded = jwtDecode(refreshToken) as { exp: number };
      refreshTokenExpiry = new Date(decoded.exp * 1000).toISOString();
    } catch (error) {
      issues.push("Refresh token 无法解码");
    }
  }

  // 检查 Store 状态
  const store = useAuthStore.getState();
  const hasUserData = !!store.allUserData && !!store.allUserData.user_id;
  const userId = store.allUserData?.user_id || null;
  const isLoggedIn = store.isLoggedIn();
  const isTeacher = store.isTeacher();

  // 检查 IndexedDB
  let authStoreExists = false;
  try {
    const { indexedDBStorage } = await import("@/utils/IndexedDBStorage");
    const authData = await indexedDBStorage.getItem("auth-store");
    authStoreExists = !!authData;
  } catch (error) {
    issues.push("无法访问 IndexedDB");
  }

  // 一致性检查
  if (hasAccessToken && hasRefreshToken && !hasUserData) {
    issues.push("有 Token 但 Store 中没有用户数据");
  }
  
  if (!hasAccessToken && !hasRefreshToken && hasUserData) {
    issues.push("没有 Token 但 Store 中有用户数据");
  }
  
  if (hasUserData && !isLoggedIn) {
    issues.push("Store 中有用户数据但 isLoggedIn() 返回 false");
  }
  
  if (!hasUserData && isLoggedIn) {
    issues.push("Store 中没有用户数据但 isLoggedIn() 返回 true");
  }

  const allConsistent = issues.length === 0;

  return {
    cookies: {
      hasAccessToken,
      hasRefreshToken,
      accessTokenExpiry,
      refreshTokenExpiry,
    },
    store: {
      hasUserData,
      userId,
      isLoggedIn,
      isTeacher,
    },
    indexedDB: {
      authStoreExists,
    },
    consistency: {
      allConsistent,
      issues,
    },
  };
};

/**
 * 在控制台输出格式化的认证状态信息
 */
export const logAuthState = async () => {
  const authState = await debugAuthState();
  
  console.group("🔐 认证状态调试信息");
  
  console.group("🍪 Cookies");
  console.log("Access Token:", authState.cookies.hasAccessToken ? "✅ 存在" : "❌ 不存在");
  console.log("Refresh Token:", authState.cookies.hasRefreshToken ? "✅ 存在" : "❌ 不存在");
  if (authState.cookies.accessTokenExpiry) {
    console.log("Access Token 过期时间:", authState.cookies.accessTokenExpiry);
  }
  if (authState.cookies.refreshTokenExpiry) {
    console.log("Refresh Token 过期时间:", authState.cookies.refreshTokenExpiry);
  }
  console.groupEnd();
  
  console.group("🏪 Store 状态");
  console.log("用户数据:", authState.store.hasUserData ? "✅ 存在" : "❌ 不存在");
  console.log("用户ID:", authState.store.userId || "无");
  console.log("isLoggedIn():", authState.store.isLoggedIn ? "✅ true" : "❌ false");
  console.log("isTeacher():", authState.store.isTeacher ? "✅ true" : "❌ false");
  console.groupEnd();
  
  console.group("💾 IndexedDB");
  console.log("auth-store:", authState.indexedDB.authStoreExists ? "✅ 存在" : "❌ 不存在");
  console.groupEnd();
  
  console.group("🔍 一致性检查");
  if (authState.consistency.allConsistent) {
    console.log("✅ 所有状态一致");
  } else {
    console.log("❌ 发现不一致问题:");
    authState.consistency.issues.forEach(issue => {
      console.log(`  • ${issue}`);
    });
  }
  console.groupEnd();
  
  console.groupEnd();
  
  return authState;
};

/**
 * 监控认证状态变化（用于开发调试）
 */
export const startAuthMonitoring = () => {
  if (process.env.NODE_ENV !== 'development') {
    console.warn("认证状态监控只能在开发环境中使用");
    return;
  }

  console.log("🔍 开始监控认证状态变化...");
  
  // 监控 Store 变化
  const unsubscribe = useAuthStore.subscribe((state) => {
    console.log("🔄 认证状态变化:", {
      hasUserData: !!state.allUserData,
      userId: state.allUserData?.user_id,
      isLoggedIn: state.isLoggedIn(),
      cartCount: state.cart_count,
    });
  });

  return unsubscribe;
};

// 暴露到全局对象供调试使用
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).debugAuth = {
    logAuthState,
    debugAuthState,
    startAuthMonitoring,
  };
}
