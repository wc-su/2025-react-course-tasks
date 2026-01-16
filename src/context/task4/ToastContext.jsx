import { createContext, useState, useCallback, useMemo } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import clsx from "clsx";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastInfo, setToastInfo] = useState({});

  const openToast = useCallback((info) => {
    setToastInfo(info);
    setShowToast(true);
  }, []);
  const closeToast = useCallback(() => {
    setToastInfo({});
    setShowToast(false);
  }, []);

  const value = useMemo(
    () => ({ openToast, closeToast }),
    [openToast, closeToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {showToast && (
        <ToastContainer position="top-center">
          <Toast
            show={showToast}
            className="overflow-hidden mt-3"
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
            <Toast.Body className="bg-white">{toastInfo.bodyMsg}</Toast.Body>
          </Toast>
        </ToastContainer>
      )}
    </ToastContext.Provider>
  );
};

export { ToastContext };
