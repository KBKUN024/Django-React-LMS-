import { StorageMonitor } from './StorageMonitor';
import { indexedDBStorage } from './IndexedDBStorage';

/**
 * 调试工具 - 仅在开发环境使用
 */
export class DebugTools {
  /**
   * 将调试工具绑定到 window 对象（仅开发环境）
   */
  static bindToWindow(): void {
    if (import.meta.env.DEV) {
      (window as any).debugTools = {
        // 存储相关
        getStorageInfo: StorageMonitor.getStorageInfo,
        cleanupStorage: indexedDBStorage.cleanup,
        clearAllStorage: indexedDBStorage.clearAll,
        
        // 内存相关
        forceGC: () => {
          if ((window as any).gc) {
            (window as any).gc();
            console.log('强制垃圾回收完成');
          } else {
            console.warn('垃圾回收不可用。启动 Chrome 时添加 --js-flags="--expose-gc" 参数');
          }
        },
        
        // 性能相关
        getMemoryInfo: () => {
          if ((performance as any).memory) {
            const memory = (performance as any).memory;
            return {
              used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + 'MB',
              total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + 'MB',
              limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + 'MB'
            };
          }
          return '内存信息不可用';
        },
        
        // React Query 相关
        getQueryCache: () => {
          // 需要从全局获取 queryClient
          console.log('请在浏览器控制台中使用 window.queryClient.getQueryCache()');
        },
        
        // 日志相关
        enableVerboseLogging: () => {
          localStorage.setItem('debug_verbose', 'true');
          console.log('详细日志已启用');
        },
        
        disableVerboseLogging: () => {
          localStorage.removeItem('debug_verbose');
          console.log('详细日志已禁用');
        },
        
        // 紧急重置
        emergencyReset: async () => {
          if (confirm('确定要执行紧急重置吗？这将清除所有本地数据。')) {
            await indexedDBStorage.clearAll();
            localStorage.clear();
            sessionStorage.clear();
            console.log('紧急重置完成，页面将自动刷新');
            window.location.reload();
          }
        },
        
        // 错误监控
        getLastError: () => {
          return (window as any).debugTools?.lastError || '无错误记录';
        },
        
        // 路由信息
        getCurrentRoute: () => {
          return {
            pathname: window.location.pathname,
            search: window.location.search,
            hash: window.location.hash,
            href: window.location.href
          };
        },
        
        // React Query 状态
        getQueryClientState: () => {
          try {
            // 如果 queryClient 已经绑定到 window
            const client = (window as any).queryClient;
            if (client) {
              const cache = client.getQueryCache();
              return {
                queryCount: cache.getAll().length,
                queries: cache.getAll().map(q => ({
                  queryKey: q.queryKey,
                  state: q.state.status,
                  dataUpdatedAt: q.state.dataUpdatedAt,
                  error: q.state.error?.message
                }))
              };
            }
            return '请先绑定 queryClient 到 window.queryClient';
          } catch (error) {
            return 'Query client 状态获取失败: ' + error;
          }
        },
        
        // 监控页面崩溃
        monitorPageCrash: () => {
          // 监控 beforeunload 事件
          window.addEventListener('beforeunload', (e) => {
            console.log('页面即将卸载:', new Date().toISOString());
            localStorage.setItem('last_page_unload', new Date().toISOString());
          });
          
          // 监控 unhandledrejection
          window.addEventListener('unhandledrejection', (e) => {
            console.error('未捕获的 Promise 拒绝:', e.reason);
            localStorage.setItem('last_unhandled_rejection', JSON.stringify({
              reason: e.reason?.toString(),
              timestamp: new Date().toISOString()
            }));
          });
          
          // 监控 error
          window.addEventListener('error', (e) => {
            console.error('全局错误:', e.error);
            localStorage.setItem('last_global_error', JSON.stringify({
              message: e.error?.message,
              filename: e.filename,
              lineno: e.lineno,
              colno: e.colno,
              timestamp: new Date().toISOString()
            }));
          });
          
          console.log('页面崩溃监控已启用');
        },
        
        // 检查上次崩溃信息
        getLastCrashInfo: () => {
          return {
            lastPageUnload: localStorage.getItem('last_page_unload'),
            lastUnhandledRejection: localStorage.getItem('last_unhandled_rejection'),
            lastGlobalError: localStorage.getItem('last_global_error')
          };
        },
        
        // 清理所有 Token（JWT 死循环紧急修复）
        clearAllTokens: () => {
          try {
            // 清除 Cookies
            document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            
            // 清除 localStorage 中可能的 token
            Object.keys(localStorage).forEach(key => {
              if (key.toLowerCase().includes('token') || key.toLowerCase().includes('auth')) {
                localStorage.removeItem(key);
              }
            });
            
            console.log('所有 Token 已清除');
            return true;
          } catch (error) {
            console.error('清除 Token 失败:', error);
            return false;
          }
        },
        
        // JWT 死循环修复
        fixJWTLoop: async () => {
          console.log('🚨 执行 JWT 死循环修复...');
          
          // 1. 清除所有 Token
          (window as any).debugTools.clearAllTokens();
          
          // 2. 清除存储
          await indexedDBStorage.clearAll();
          localStorage.clear();
          sessionStorage.clear();
          
          // 3. 重置 Zustand store
          try {
            const { useAuthStore } = await import('@/store/auth');
            useAuthStore.getState().setUser(null);
            useAuthStore.getState().setProfile({} as any);
            useAuthStore.getState().setCartCount(0);
          } catch (error) {
            console.error('重置 store 失败:', error);
          }
          
          console.log('JWT 死循环修复完成，页面将刷新...');
          
          // 4. 强制刷新页面
          setTimeout(() => {
            window.location.href = '/login/';
          }, 1000);
        }
      };
      
      // 自动启用页面崩溃监控
      (window as any).debugTools.monitorPageCrash();
      
      console.log('🔧 调试工具已绑定到 window.debugTools');
      console.log('可用命令:');
      console.log('- window.debugTools.getStorageInfo() - 获取存储信息');
      console.log('- window.debugTools.getMemoryInfo() - 获取内存信息');
      console.log('- window.debugTools.cleanupStorage() - 清理存储');
      console.log('- window.debugTools.forceGC() - 强制垃圾回收');
      console.log('- window.debugTools.emergencyReset() - 紧急重置');
      console.log('- window.debugTools.getLastError() - 获取最后错误');
      console.log('- window.debugTools.getCurrentRoute() - 获取当前路由');
      console.log('- window.debugTools.getLastCrashInfo() - 获取上次崩溃信息');
      console.log('- window.debugTools.fixJWTLoop() - 修复JWT死循环（紧急）');
      console.log('- window.debugTools.clearAllTokens() - 清除所有Token');
    }
  }
  
  /**
   * 检查是否启用详细日志
   */
  static isVerboseLoggingEnabled(): boolean {
    return localStorage.getItem('debug_verbose') === 'true';
  }
  
  /**
   * 详细日志
   */
  static log(message: string, ...args: any[]): void {
    if (this.isVerboseLoggingEnabled()) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }
  
  /**
   * 性能测量
   */
  static measurePerformance<T>(name: string, fn: () => T): T {
    if (import.meta.env.DEV) {
      const start = performance.now();
      const result = fn();
      const end = performance.now();
      console.log(`[PERF] ${name}: ${(end - start).toFixed(2)}ms`);
      return result;
    }
    return fn();
  }
  
  /**
   * 异步性能测量
   */
  static async measurePerformanceAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    if (import.meta.env.DEV) {
      const start = performance.now();
      const result = await fn();
      const end = performance.now();
      console.log(`[PERF] ${name}: ${(end - start).toFixed(2)}ms`);
      return result;
    }
    return await fn();
  }
}
