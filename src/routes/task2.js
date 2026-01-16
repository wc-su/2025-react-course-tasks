import Task2 from "../pages/task2/Task2.jsx";
import Task2Login from "../pages/task2/Login.jsx";
import Task2Products from "../pages/task2/Products.jsx";

const task2Router = {
  path: "/task2",
  Component: Task2,
  children: [
    {
      index: true,
      Component: Task2Login,
    },
    {
      path: "products",
      Component: Task2Products,
    },
  ],
};

export default task2Router;
