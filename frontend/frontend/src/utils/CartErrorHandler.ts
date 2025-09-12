import GenerateCartId from "./GenerateCartId";
import { getCartCount } from "@/api/auth";
import Toast from "@/utils/SweetAlert2/Toast";

/**
 * 购物车错误处理和恢复工具
 */
export class CartErrorHandler {
  /**
   * 检测并修复购物车状态问题
   */
  static async detectAndFixCartIssues(): Promise<boolean> {
    try {
      const cartId = localStorage.getItem("cart_id");

      // 检查cart_id是否存在
      // 如果cartId不存在
      if (!cartId) {
        console.warn("检测到cart_id缺失，正在重新生成...");
        const newCartId = GenerateCartId();

        if (newCartId) {
          await getCartCount(newCartId);
          Toast.fire({
            icon: "info",
            title: "购物车状态已恢复",
            timer: 2000,
          });
          return true;
        }
      }

      // 检查购物车数据是否有效
      try {
        console.log('haha')
        await getCartCount(cartId as string);
        return true;
      } catch (error) {
        console.warn("购物车数据无效，正在重新初始化...", error);
        const newCartId = GenerateCartId();
        if (newCartId) {
          await getCartCount(newCartId);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("购物车状态修复失败:", error);
      return false;
    }
  }

  /**
   * 清理无效的购物车数据
   */
  static clearInvalidCartData(): void {
    const cartId = localStorage.getItem("cart_id");
    if (
      cartId &&
      (cartId === "null" || cartId === "undefined" || cartId === "")
    ) {
      localStorage.removeItem("cart_id");
      console.log("已清理无效的cart_id");
    }
  }
}
