import { useContext } from "react";

import { LoadingContext } from "@/context/task3/LoadingContext.jsx";

export const useLoading = () => useContext(LoadingContext);
