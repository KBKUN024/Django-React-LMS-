import { jwtDecode } from "jwt-decode";
import Cookie from "js-cookie";

interface UserData {
  email: string;
  exp: number;
  full_name: string;
  jti: string;
  token_type: string;
  user_id: string;
  username: string;
  teacher_id: string;
}

function GetUserData(): UserData | null {
  const refresh_token = Cookie.get("refresh_token");
  const access_token = Cookie.get("access_token");

  if (refresh_token && access_token) {
    try {
      // 修改：从access_token解码用户数据，因为access_token包含当前的用户信息
      const decoded_data = jwtDecode(access_token) as UserData;
      return decoded_data;
    } catch (error) {
      console.error("GetUserData: JWT decode failed", error);
      // 如果access_token解码失败，尝试从refresh_token解码（fallback）
      try {
        const decoded_data = jwtDecode(refresh_token) as UserData;
        return decoded_data;
      } catch (fallbackError) {
        console.error("GetUserData: Fallback JWT decode also failed", fallbackError);
        return null;
      }
    }
  }
  return null;
}
export default GetUserData;
