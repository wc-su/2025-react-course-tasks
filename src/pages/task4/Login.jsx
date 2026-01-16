import { useState } from "react";
import { useNavigate, Navigate } from "react-router";
import { useAuth } from "@/hooks/task4/useAuth.js";
import { useLoading } from "@/hooks/task4/useLoading.js";
import { useToast } from "@/hooks/task4/useToast.js";

function Login() {
  const navigate = useNavigate();
  const { token, login } = useAuth();
  const { openLoading, closeLoading } = useLoading();
  const { openToast } = useToast();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  if (token) {
    return <Navigate to="/task4/products" replace />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    openLoading();
    const result = await login(formData);
    if (result.success) {
      navigate("/task4/products");
    } else {
      openToast({
        textColor: "danger",
        title: "登入失敗",
        bodyMsg: result.message || "請稍後再試",
      });
    }
    closeLoading();
  };

  return (
    <div className="container task4-login">
      <div className="row justify-content-center">
        <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
        <div className="col-8">
          <form id="form" className="task4-form-signin" onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="username"
                name="username"
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
                name="password"
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
