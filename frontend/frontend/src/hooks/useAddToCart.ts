import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAuthenticatedAxios } from "@/api/axios";
import { getCartCount } from "@/api/auth";
import Toast from "@/utils/SweetAlert2/Toast";
import Swal from "sweetalert2";
function useAddToCart() {
  const authAxios = createAuthenticatedAxios();
  const queryClient = useQueryClient();
  const addToCartMutation = async (
    course_id: string,
    user_id: string,
    price: string,
    country: string,
    cart_id: string
  ) => {
    const formData = new FormData();
    formData.append("course_id", course_id);
    formData.append("user_id", user_id);
    formData.append("price", price);
    formData.append("country_name", country);
    formData.append("cart_id", cart_id);
    await authAxios.post("cart/add-cart/", formData);
  };
  const mutation = useMutation({
    mutationFn: (variables: {
      course_id: string;
      user_id: string;
      price: string;
      country_name: string;
      cart_id: string;
    }) =>
      addToCartMutation(
        variables.course_id,
        variables.user_id,
        variables.price,
        variables.country_name,
        variables.cart_id
      ),
    onSuccess: async () => {
      // 使课程详情缓存失效，强制重新获取数据。这样当添加购物车成功后，会自动重新获取最新的课程详情数据，显示正确的添加状态。
      queryClient.invalidateQueries({ queryKey: ["course-detail"] });
      queryClient.invalidateQueries({ queryKey: ["courses_list"] });
      queryClient.invalidateQueries({ queryKey: ["cart-list"] });
      queryClient.invalidateQueries({ queryKey: ["cart-stats"] }); // 购物车状态在所有页面都需要更新
      const cart_id = localStorage.getItem("cart_id");
      if (cart_id) {
        await getCartCount(cart_id); // 当add to cart成功之后，调用一下api，设置正确的数量，不然用户多个标签页之间如果同时添加购物车会造成状态混乱
      }

      Toast.fire({
        icon: "success",
        text: "添加到购物车成功",
      });
      console.log("mutationSuccess: 添加到购物车成功");
      // 这里可以添加成功提示，比如toast或者跳转到购物车页面
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        text: "添加到购物车失败" + error,
      });
      console.error("添加到购物车失败:", error);
      // 这里可以添加错误提示
    },
  });
  const addToCart = (
    course_id: string,
    user_id: string,
    price: string,
    country_name: string,
    cart_id: string
  ) => {
    mutation.mutate({
      course_id: course_id, // 这里要传递的居然是课程的主键，而不是真正的course_id，可能需要改。已更改
      user_id: user_id,
      price: price,
      country_name: country_name,
      cart_id: cart_id, // 可以是任意的cart_id，所以这里使用随机的id
    });
  };
  return {
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    addToCart,
  };
}
export default useAddToCart;
