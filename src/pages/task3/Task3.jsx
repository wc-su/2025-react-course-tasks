import { Outlet } from "react-router";
import { AuthProvider } from "@/context/task3/AuthContext.jsx";
import { LoadingProvider } from "@/context/task3/LoadingContext.jsx";
import { ToastProvider } from "@/context/task3/ToastContext.jsx";

import "assets/css/task3.css";

function Task3() {
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

export default Task3;
