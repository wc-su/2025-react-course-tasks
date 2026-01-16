import { useContext } from "react";

import { LoadingContext } from "@/context/task4/LoadingContext.jsx";

export const useLoading = () => useContext(LoadingContext);
