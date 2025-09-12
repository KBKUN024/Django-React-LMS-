import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { GenerateCartId } from "@/utils";
import { getCartCount } from "@/api/auth";

/**
 * 购物车状态同步Hook
 * 处理cart_id丢失、用户状态变化等场景下的购物车状态同步
 */
export const useCartSync = (from: string) => {
  console.log("from:", from);
  const { allUserData, hydrated, setCartCount } = useAuthStore();
  // 直接计算登录状态，不依赖可能丢失的方法
  const userLoggedIn = !!allUserData;
  /**
     * 这个 useEffect 的依赖数组 [allUserData?.user_id, hydrated, setCartCount] 表示：
        当 allUserData?.user_id 发生变化时（比如用户登录/登出）
        当 hydrated 发生变化时（数据恢复状态改变）
        当 setCartCount 发生变化时（虽然这个函数引用通常不会变）
        这 3 个当中任何一个依赖项变化，都会触发执行 syncCartStatus 函数来同步购物车状态。
        这样设计的目的是确保在用户状态变化或应用初始化完成后，购物车状态能够及时同步更新。
     */
  useEffect(() => {
    let isMounted = true;
    console.log('购物车状态同步 - from:', from)
    
    const syncCartStatus = async () => {
      // 检查组件是否还挂载
      if (!isMounted || !hydrated) return;

      try {
        // 重新生成或获取cart_id（现在会根据用户状态智能处理）
        const cartId = GenerateCartId();

        if (cartId && isMounted) {
          console.log('登录状态:',userLoggedIn)
          // 当用户已经登录了的情况下，进行重新获取购物车数量
          if (userLoggedIn) {
            await getCartCount(cartId);
          }
        } else if (isMounted) {
          // 如果无法获取cart_id，重置购物车状态
          setCartCount(0);
        }
      } catch (error) {
        console.error("购物车状态同步失败:", error);
        // 发生错误时重置购物车数量
        if (isMounted) {
          setCartCount(0);
        }
      }
    };

    syncCartStatus();
    
    // 清理函数
    return () => {
      isMounted = false;
    };
  }, [allUserData?.user_id, hydrated, setCartCount, userLoggedIn, from]);

  // 提供手动同步方法
  const manualSync = async () => {
    try {
      const cartId = GenerateCartId();
      if (cartId) {
        await getCartCount(cartId);
      }
    } catch (error) {
      console.error("手动同步购物车失败:", error);
      setCartCount(0);
    }
  };

  return { manualSync };
};
