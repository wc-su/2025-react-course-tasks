import { useContext } from "react";

import { ToastContext } from "@/context/task4/ToastContext.jsx";

export const useToast = () => useContext(ToastContext);
