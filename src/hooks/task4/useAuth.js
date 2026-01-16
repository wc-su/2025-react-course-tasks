import { useContext } from "react";

import { AuthContext } from "@/context/task4/AuthContext.jsx";

export const useAuth = () => useContext(AuthContext);
