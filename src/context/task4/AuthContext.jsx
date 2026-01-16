import { createContext, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { getAPI_BASE } from "@/utils/util.js";

const AuthContext = createContext(null);

const API_BASE = getAPI_BASE();

// 從 cookie 讀取 token 的輔助函式
const getToken = () => {
  const token = document.cookie.replace(
    /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
    "$1"
  );
  return token || null;
};

export const AuthProvider = ({ children }) => {
  // 初始化時直接讀取 cookie，這樣重新整理才不會被登出
  const [token, setToken] = useState(() => getToken());

  // 登入函式：存入 state 也存入 cookie
  const login = useCallback(async (formData) => {
    try {
      const response = await axios.post(`${API_BASE}/admin/signin`, formData);
      const { token: newToken, expired } = response.data;
      setToken(newToken);
      document.cookie = `hexToken=${newToken}; expires=${new Date(
        expired
      ).toUTCString()}`;
      return { success: true, message: "登入成功" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "登入失敗，請稍後再試",
      };
    }
  }, []);

  // 登出函式：清除 state 和 cookie
  const logout = useCallback(async () => {
    try {
      await axios.post(`${API_BASE}/logout`, null, {
        headers: { Authorization: token },
      });
      setToken(null);
      document.cookie = "hexToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      return { success: true, message: "登出成功" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "登出失敗，請稍後再試",
      };
    }
  }, [token]);

  const adminCheck = useCallback(async () => {
    try {
      await axios.post(`${API_BASE}/api/user/check`, null, {
        headers: { Authorization: token },
      });
      return { success: true, message: "驗證成功" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "驗證失敗，請稍後再試",
      };
    }
  }, [token]);

  const value = useMemo(
    () => ({ token, login, logout, adminCheck }),
    [token, login, logout, adminCheck]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
