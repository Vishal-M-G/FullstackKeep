import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./NavBar";
import User from "./User";
import Admin from "./Admin";
import HomeUser from "./HomeUser";
import HomeAdmin from "./HomeAdmin";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<NavBar />}>
            <Route index element={<Admin />} />
            <Route path="userLogin" element={<User />} />
            <Route path="admin" element={<HomeAdmin />} />
            <Route path="user" element={<HomeUser />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
