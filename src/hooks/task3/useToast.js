import { useContext } from "react";

import { ToastContext } from "@/context/task3/ToastContext.jsx";

export const useToast = () => useContext(ToastContext);
