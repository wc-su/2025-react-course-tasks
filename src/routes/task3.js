import { redirect } from "react-router";
import Task3 from "../pages/task3/Task3.jsx";
import Login from "../pages/task3/Login.jsx";
import Products from "../pages/task3/Products.jsx";
import PrivateRoute from "../pages/task3/PrivateRoute.jsx";

const task3Router = {
  path: "/task3",
  Component: Task3,
  children: [
    {
      index: true,
      loader: () => redirect("/task3/login"),
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

export default task3Router;
