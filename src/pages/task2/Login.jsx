import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useOutletContext } from "react-router";

function Login() {
  const navigate = useNavigate();
  const { API_BASE, setIsLoading, setShowToast, setToastInfo, checkAuth } =
    useOutletContext();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // 倒數計時 Toast
  const showCountdownToast = ({
    seconds,
    title,
    bodyMsg,
    textColor,
    onComplete,
  }) => {
    setShowToast(true);
    let countdown = seconds;

    // 顯示初始訊息
    setToastInfo({
      title,
      bodyMsg: bodyMsg.replace("{countdown}", countdown),
      textColor,
    });

    const timer = setInterval(() => {
      countdown -= 1;
      if (countdown > 0) {
        setToastInfo({
          title,
          bodyMsg: bodyMsg.replace("{countdown}", countdown),
          textColor,
        });
      } else {
        clearInterval(timer);
        setShowToast(false);
        onComplete?.();
      }
    }, 1000);

    // 回傳清除函式，以便需要時取消倒數
    return () => clearInterval(timer);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const url = `${API_BASE}/admin/signin`;
    const payload = {
      username: formData.username,
      password: formData.password,
    };

    try {
      const res = await axios.post(url, payload);
      localStorage.setItem("hexToken", res.data.token);

      showCountdownToast({
        seconds: 3,
        title: "登入成功",
        bodyMsg: "{countdown} 秒後自動跳轉產品列表頁",
        textColor: "success",
        onComplete: () => navigate("/task2/products"),
      });
    } catch (err) {
      setShowToast(true);
      setToastInfo({
        title: "登入失敗",
        bodyMsg: err?.response?.data?.message || "未知錯誤",
        textColor: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData((prevFormatData) => ({
      ...prevFormatData,
      [e.target.id]: e.target.value,
    }));
  };

  useEffect(() => {
    const token = localStorage.getItem("hexToken");
    // 已有 token 且驗證成功後，導向產品列表頁
    const verifyTokenAndRedirect = async () => {
      const isAuth = await checkAuth(token);
      if (isAuth) {
        navigate("/task2/products");
      }
    };
    verifyTokenAndRedirect();
  }, [checkAuth, navigate]);

  return (
    <div className="container task2-login">
      <div className="row justify-content-center">
        <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
        <div className="col-8">
          <form id="form" className="task2-form-signin" onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="username"
                placeholder="name@example.com"
                value={formData.username}
                onChange={handleInputChange}
                required
                autoFocus
              />
              <label htmlFor="username">Email address</label>
            </div>
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="password">Password</label>
            </div>
            <button className="btn btn-lg btn-primary w-100 mt-3" type="submit">
              登入
            </button>
          </form>
        </div>
      </div>
      <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
    </div>
  );
}

export default Login;
