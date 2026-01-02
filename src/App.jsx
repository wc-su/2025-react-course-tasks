import { Link } from "react-router"

function App() {

  return (
    <div className="container py-5">
      <h1 className="text-center mb-5">2025 六角學院 React 前端框架學程</h1>
      <div className="row">
        <div className="col text-center">
          <Link to="/task2" className="btn btn-primary">Go to Task 2</Link>
        </div>
        {/* <div className="col">
          <Link to="/task3">Go to Task 3</Link>
        </div> */}
      </div>
    </div>
  )
}

export default App
