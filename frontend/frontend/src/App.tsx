import { Route, Routes, BrowserRouter } from "react-router-dom";
import { MainWrapper, PrivateRoute, TeacherPrivateRoute } from "@/layouts";
import {
  Register,
  Login,
  Logout,
  ForgotPassword,
  CreateNewPassword,
} from "@/views/auth";
import { Carts, Index, CourseDetail, Checkout, Success, Search } from "@/views/base";
import { StudentDashBoard, StudentCourses, StudentCourseDetail, Wishlist, StudentProfile } from '@/views/student'
import { ChangePassword, Dashboard, Courses, Review, Students, Earning, Coupon, Orders, TeacherNotification, QA, Profile, CourseCreate, CourseEdit } from '@/views/instructor'
import ScrollToTop from "@/components/ScrollToTop";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useEffect } from "react";
import { CartErrorHandler } from "@/utils/CartErrorHandler";
import { useCartSync } from "@/hooks/useCartSync";
import { StorageMonitor } from "@/utils/StorageMonitor";
import { DebugTools } from "@/utils/DebugTools";

function App() {
  const queryClient = new QueryClient({
    // 你的全局默认配置（可选）
    defaultOptions: {
      queries: {
        retry: 3,
        staleTime: 5 * 60 * 1000, // 5分钟
        gcTime: 10 * 60 * 1000, // 10分钟后清理缓存
        refetchOnWindowFocus: false, // 减少不必要的重新获取
      },
      mutations: {
        retry: 1,
      },
    },
  });

  useCartSync('app');

  // 应用启动时初始化监控和错误处理
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // 启动存储监控
        StorageMonitor.startMonitoring();

        // 启用调试工具（仅开发环境）
        DebugTools.bindToWindow();

        // 绑定 queryClient 到 window 以便调试
        if (import.meta.env.DEV) {
          (window as any).queryClient = queryClient;
        }

        // // 清理无效数据
        // CartErrorHandler.clearInvalidCartData();

        // // 检测并修复购物车问题
        // await CartErrorHandler.detectAndFixCartIssues();

        console.log('应用初始化完成');
      } catch (error) {
        console.error('应用初始化失败:', error);
      }
    };

    initializeApp();

    // 清理函数
    return () => {
      StorageMonitor.stopMonitoring();
    };
  }, []);
  return (
    <BrowserRouter>
      <ScrollToTop />
      <QueryClientProvider client={queryClient}>
        <MainWrapper>
          <Routes>
            <Route
              path="/register/"
              element={<Register />}
            />
            <Route
              path="/login/"
              element={<Login />}
            />
            <Route
              path="/logout/"
              element={<Logout />}
            />
            <Route
              path="/forgot-password/"
              element={<ForgotPassword />}
            />
            <Route
              path="/create-new-password/"
              element={<CreateNewPassword />}
            />
            {/* Base Routes */}
            <Route
              path="/"
              element={<Index />}
            />
            <Route
              path="/course-detail/:slug/"
              element={
                <PrivateRoute>
                  <CourseDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/cart/"
              element={
                <PrivateRoute>
                  <Carts />
                </PrivateRoute>
              }
            />
            <Route
              path="/checkout/:order_id/"
              element={
                <PrivateRoute>
                  <Checkout />
                </PrivateRoute>
              }
            />
            <Route
              path="/payment-success/:cart_order_id/"
              element={
                <PrivateRoute>
                  <Success />
                </PrivateRoute>
              }
            />
            <Route
              path="/search/"
              element={
                <Search />
              }
            />
            {/* Student Routes */}
            <Route
              path="/student/dashboard/"
              element={
                <PrivateRoute>
                  <StudentDashBoard />
                </PrivateRoute>
              }
            />
            <Route
              path="/student/courses/"
              element={
                <PrivateRoute>
                  <StudentCourses />
                </PrivateRoute>
              }
            />
            <Route
              path="/student/courses/:enrollment_id"
              element={
                <PrivateRoute>
                  <StudentCourseDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/student/wishlist/"
              element={
                <PrivateRoute>
                  <Wishlist />
                </PrivateRoute>
              }
            />
            <Route
              path="/student/profile/"
              element={
                <PrivateRoute>
                  <StudentProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/student/change-password/"
              element={
                <ChangePassword />
              }
            />
            {/* Teacher Routes */}
            <Route path="/instructor/dashboard/" element={
              <PrivateRoute>
                <TeacherPrivateRoute>
                  <Dashboard />
                </TeacherPrivateRoute>
              </PrivateRoute>
            } />
            <Route path="/instructor/courses/" element={
              <PrivateRoute>
                <TeacherPrivateRoute>
                  <Courses />
                </TeacherPrivateRoute>
              </PrivateRoute>
            } />
            <Route path="/instructor/reviews/" element={
              <PrivateRoute>
                <TeacherPrivateRoute>
                  <Review />
                </TeacherPrivateRoute>
              </PrivateRoute>

            } />
            <Route path="/instructor/students/" element={
              <PrivateRoute>
                <TeacherPrivateRoute>
                  <Students />
                </TeacherPrivateRoute>
              </PrivateRoute>

            } />
            <Route path="/instructor/earning/" element={
              <PrivateRoute>
                <TeacherPrivateRoute>
                  <Earning />
                </TeacherPrivateRoute>
              </PrivateRoute>

            } />
            <Route path="/instructor/orders/" element={
              <PrivateRoute>
                <TeacherPrivateRoute>
                  <Orders />
                </TeacherPrivateRoute>
              </PrivateRoute>

            } />
            <Route path="/instructor/coupon/" element={
              <PrivateRoute>
                <TeacherPrivateRoute>
                  <Coupon />
                </TeacherPrivateRoute>
              </PrivateRoute>

            } />
            <Route
              path="instructor/change-password/"
              element={
                <PrivateRoute>
                  <TeacherPrivateRoute>
                    <ChangePassword />
                  </TeacherPrivateRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/instructor/notifications/"
              element={
                <PrivateRoute>
                  <TeacherPrivateRoute>
                    <TeacherNotification />
                  </TeacherPrivateRoute>
                </PrivateRoute>
              }
            />
            <Route path="/instructor/question-answer/" element={
              <PrivateRoute>
                <TeacherPrivateRoute>
                  <QA />
                </TeacherPrivateRoute>
              </PrivateRoute>
            } />
            <Route path="/instructor/profile/" element={
              <PrivateRoute>
                <TeacherPrivateRoute>
                  <StudentProfile />
                </TeacherPrivateRoute>
              </PrivateRoute>
            } />
            <Route
              path="/instructor/create-course/"
              element={
                <PrivateRoute>
                  <TeacherPrivateRoute>
                    <CourseCreate />
                  </TeacherPrivateRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/instructor/edit-course/:course_id/"
              element={
                <PrivateRoute>
                  <TeacherPrivateRoute>
                    <CourseEdit />
                  </TeacherPrivateRoute>
                </PrivateRoute>
              }
            />
          </Routes>
        </MainWrapper>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
