function handleMutationError(error: unknown) {
  let errorMessage = "课程创建失败";

  // 更安全的错误信息解析
  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response?: { data?: unknown } }).response;
    if (response?.data) {
      console.log("完整错误信息:", response.data);

      const errorData = response.data as Record<string, unknown>;

      // 检查title字段错误
      if (errorData.title && Array.isArray(errorData.title)) {
        errorMessage = String(errorData.title[0]);
      }
      // 检查其他可能的错误字段
      else if (
        errorData.non_field_errors &&
        Array.isArray(errorData.non_field_errors)
      ) {
        errorMessage = String(errorData.non_field_errors[0]);
      }
      // 检查详细错误信息
      else if (errorData.detail && typeof errorData.detail === "string") {
        errorMessage = errorData.detail;
      }
      // 如果有其他字段错误，显示第一个
      else {
        const firstError = Object.values(errorData)[0];
        if (Array.isArray(firstError)) {
          errorMessage = String(firstError[0]);
        } else if (typeof firstError === "string") {
          errorMessage = firstError;
        }
      }
    }
  }
  return errorMessage;
}
export { handleMutationError };
