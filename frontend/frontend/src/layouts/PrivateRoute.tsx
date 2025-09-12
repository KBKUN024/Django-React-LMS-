import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuthStore } from "@/store/auth";

/**
 * PrivateRoute 组件用于保护需要登录后才能访问的路由。
 *
 * 使用方法：
 * <PrivateRoute>
 *   <YourProtectedComponent />
 * </PrivateRoute>
 *
 * 逻辑说明：
 * - 通过 useAuthStore 获取 isLoggedIn 方法，判断当前用户是否已登录。
 * - 如果已登录，则渲染子组件（children）。
 * - 如果未登录，则重定向到登录页（/login/）。
 *
 * children 需要保护的子组件
 * return 这一句：已登录则渲染 children，否则重定向到登录页
 */
function PrivateRoute({ children }: { children: ReactNode }) {
  const { hydrated, allUserData } = useAuthStore()
  // 直接计算登录状态，不依赖可能丢失的方法
  const userLoggedIn = !!allUserData

  // 如果数据还没有从IndexedDB中恢复，显示加载状态
  if (!hydrated) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  // 如果已登录，渲染子组件；否则跳转到登录页
  return userLoggedIn ? <>{children}</> : <Navigate to="/login/" />;
}

export default PrivateRoute;
