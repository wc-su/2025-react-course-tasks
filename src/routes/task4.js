import { redirect } from "react-router";
import Task4 from "../pages/task4/Task4.jsx";
import Login from "../pages/task4/Login.jsx";
import Products from "../pages/task4/Products.jsx";
import PrivateRoute from "../pages/task4/PrivateRoute.jsx";

const task4Router = {
  path: "/task4",
  Component: Task4,
  children: [
    {
      index: true,
      loader: () => redirect("/task4/login"),
    },
    {
      path: "login",
      Component: Login,
    },
    {
      Component: PrivateRoute,
      children: [
        {
          path: "products",
          Component: Products,
        },
      ],
    },
  ],
};

export default task4Router;
