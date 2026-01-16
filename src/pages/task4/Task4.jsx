import { Outlet } from "react-router";
import { AuthProvider } from "@/context/task4/AuthContext.jsx";
import { LoadingProvider } from "@/context/task4/LoadingContext.jsx";
import { ToastProvider } from "@/context/task4/ToastContext.jsx";

import "assets/css/task4.css";

function Task4() {
  return (
    <>
      <AuthProvider>
        <LoadingProvider>
          <ToastProvider>
            <Outlet />
          </ToastProvider>
        </LoadingProvider>
      </AuthProvider>
    </>
  );
}

export default Task4;
