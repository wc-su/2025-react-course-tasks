import { createContext, useState, useCallback, useMemo } from "react";

const LoadingContext = createContext(null);

export const LoadingProvider = ({ children }) => {
  // 管理同時進行中的載入請求數量
  const [loadingRequestCount, setLoadingRequestCount] = useState(0);

  // 開啟 Loading
  const openLoading = useCallback(() => {
    setLoadingRequestCount((count) => count + 1);
  }, []);
  // 關閉 Loading
  const closeLoading = useCallback(() => {
    setLoadingRequestCount((count) => Math.max(count - 1, 0));
  }, []);

  const value = useMemo(
    () => ({ openLoading, closeLoading }),
    [openLoading, closeLoading]
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {loadingRequestCount > 0 && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ zIndex: 2000 }}
        >
          <div className="position-absolute top-0 start-0 w-100 h-100 bg-white opacity-50"></div>
          <div className="position-relative">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
};

export { LoadingContext };
