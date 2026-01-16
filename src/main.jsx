import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import App from "./App.jsx";
import task2Router from "./routes/task2.js";
import task3Router from "./routes/task3.js";
import task4Router from "./routes/task4.js";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
  },
  task2Router,
  task3Router,
  task4Router,
  {
    path: "*",
    element: <h1 className="text-center mt-5">404 Not Found</h1>,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
