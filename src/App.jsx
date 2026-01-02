import { Link } from "react-router";

function App() {
  return (
    <div className="container py-5">
      <h1 className="text-center mb-5">2025 六角學院 React 前端框架學程</h1>
      <ul className="list-unstyled">
        <li className="text-center mb-3">
          <Link to="/task2" className="btn btn-primary mx-auto">
            第二週 - RESTful API 串接
          </Link>
        </li>
        <li className="text-center mb-3">
          <Link
            to="/task3"
            className="btn btn-outline-primary mx-auto disabled"
          >
            第三週 - 熟練 React.js
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default App;
