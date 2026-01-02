import "assets/css/Task2.css";
import { Outlet } from "react-router";
import { useState, useCallback } from "react";
import clsx from "clsx";
import axios from "axios";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Task2() {
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastInfo, setToastInfo] = useState({});

  const checkAuth = useCallback(async (token) => {
    if (!token) return false;

    setIsLoading(true);
    // 驗證 token
    try {
      // 驗證 token
      await axios.post(
        `${API_BASE}/api/user/check`,
        {},
        { headers: { Authorization: token } }
      );
    } catch (err) {
      setShowToast(true);
      setToastInfo({
        title: "錯誤",
        bodyMsg: `驗證失敗: ${err?.response?.data?.message || "未知錯誤"}`,
        textColor: "danger",
      });
      return false;
    } finally {
      setIsLoading(false);
    }

    return true;
  }, []);

  return (
    <>
      <Outlet
        context={{
          API_BASE,
          API_PATH,
          setIsLoading,
          setShowToast,
          setToastInfo,
          checkAuth,
        }}
      />
      {isLoading && <Loading />}
      {showToast && (
        <ToastComponent
          toastInfo={toastInfo}
          setShowToast={setShowToast}
          setToastInfo={setToastInfo}
        />
      )}
    </>
  );
}

function Loading() {
  return (
    <div className="fixed-top bg-white bg-opacity-50">
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );
}

function ToastComponent({ toastInfo, showToast, setShowToast }) {
  return (
    <ToastContainer position="top-center">
      <Toast
        show={showToast}
        className="mt-3"
        position="top-center"
        onClose={() => setShowToast(false)}
      >
        <Toast.Header>
          <strong
            className={clsx(
              "me-auto",
              toastInfo?.textColor && `text-${toastInfo.textColor}`
            )}
          >
            {toastInfo.title}
          </strong>
        </Toast.Header>
        <Toast.Body>{toastInfo.bodyMsg}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default Task2;
