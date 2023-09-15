import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from "react-router-dom";
import Home from "./pages/home/index";
import Login from "./pages/login";
import Register from "./pages/register";

function App() {
  return (
    <Router>
        <div>
            <nav>
                <ul>
                    <li>
                        <Link to="/home">Home</Link>
                    </li>
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                    <li>
                        <Link to="/register">Register</Link>
                    </li>
                </ul>
            </nav>

            {/* A <Routes> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </div>
    </Router>
  );
}

export default App;
