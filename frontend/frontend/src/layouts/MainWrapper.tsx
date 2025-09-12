import { useEffect, useTransition } from "react";
import type { ReactNode } from "react";
import { CheckUser } from "@/api/auth";
import { useNavigate, useLocation } from 'react-router-dom'
import { createAuthenticatedAxios } from '@/api/axios'
import { GetUserData } from '@/utils'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store'
import BaseHeader from '@/views/partials/BaseHeader'
import BaseFooter from '@/views/partials/BaseFooter'
/**
 * MainWrapper 组件
 *
 * 该组件用于在应用的主布局中包裹所有子组件，负责在页面加载时进行用户认证信息的初始化。
 * 只有在用户认证信息加载完成后，才会渲染其子组件（即页面内容），否则页面内容不会显示。
 *
 * 主要逻辑：
 * 1. 组件挂载时，调用 setUser() 检查并设置当前用户信息（如校验 token、自动刷新 token 等）。
 * 2. 在 setUser() 执行完毕后，将 loading 状态设为 false，允许页面内容渲染。
 * 3. loading 为 true 时，页面内容不渲染（可根据需要添加 loading 动画）。
 *
 * @param children - 需要被包裹的页面内容（ReactNode）
 */
function MainWrapper({ children }: { children: ReactNode }) {
  // loading 状态，使用react19的useTransition钩子，会自动处理loading的状态，异步请求一开始，就会自动将loading设置为true，结束自动设置为false
  const [loading, startLoading] = useTransition();
  const navigate = useNavigate()
  const authAxios = createAuthenticatedAxios()
  const userData = GetUserData()
  const location = useLocation()
  const { setProfile } = useAuthStore()
  const { data: profileData } = useQuery({
    queryKey: ['user-profile', userData?.user_id],
    queryFn: async () => {
      const response = await authAxios.get(`user/profile/${userData?.user_id}`)
      return response.data
    },
    enabled: !loading && !!userData?.user_id,
  })

  // 当profile数据加载完成后，设置到store中
  useEffect(() => {
    if (profileData) {
      setProfile(profileData)
    }
  }, [profileData])
  /**
   * handler 函数
   * 异步执行 setUser（初始化用户信息），完成后设置 loading 为 false
   * 🧐 这里的useCallback有什么用？
   */
  const handler = async () => {
    startLoading(async () => {
      try {
        const status = await CheckUser(); // 初始化用户信息（如校验 token、自动刷新 token 等）
        console.log('CheckUser status:', status, 'Current path:', location.pathname)
        
        // 避免无限重定向 - 添加更严格的路径检查
        const publicPaths = ['/login/', '/register/', '/forgot-password/', '/create-new-password/'];
        const isPublicPath = publicPaths.includes(location.pathname);
        
        if (!status && !isPublicPath) {
          console.log('用户未登录，重定向到登录页');
          navigate('/login/');
        } else if (status && location.pathname === '/login/') {
          console.log('用户已登录，重定向到首页');
          navigate('/');
        }
      } catch (error) {
        console.error('MainWrapper handler error:', error);
        // 错误情况下重定向到登录页
        if (location.pathname !== '/login/') {
          navigate('/login/');
        }
      }
    });
  };

  // 组件挂载时执行 handler，只执行一次
  useEffect(() => {
    handler();
  }, []);

  // loading 为 true 时不渲染 children，等用户信息加载完毕后再渲染
  return (
    <>
      <BaseHeader />
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
          <div className="text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        children
      )}
      <BaseFooter />
    </>
  );
}

export default MainWrapper;
