import { Outlet, Navigate } from "react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/task4/useAuth.js";
import { useLoading } from "@/hooks/task4/useLoading.js";

function PrivateRoute() {
  const { token, adminCheck } = useAuth();
  const { openLoading, closeLoading } = useLoading();

  const [isChecked, setIsChecked] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const check = async () => {
      openLoading();
      const isValid = await adminCheck();
      setIsChecked(true);
      setIsAuthorized(isValid.success);
      closeLoading();
    };

    check();
  }, [adminCheck, token, openLoading, closeLoading]);

  if (!token || (isChecked && !isAuthorized)) {
    return <Navigate to="/task4/login" replace />;
  }

  if (!isChecked) {
    return null;
  }

  if (isChecked && isAuthorized) {
    return <Outlet />;
  }
}

export default PrivateRoute;
