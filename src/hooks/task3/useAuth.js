import { useContext } from "react";

import { AuthContext } from "@/context/task3/AuthContext.jsx";

export const useAuth = () => useContext(AuthContext);
