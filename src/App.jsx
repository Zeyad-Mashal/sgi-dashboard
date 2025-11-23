import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import SideNav from "./Components/Navbar/SideNav/SideNav";
import TopNav from "./Components/Navbar/TopNav/TopNav";
import Brand from "./pages/Brand/Brand";
import Companies from "./pages/Companies/Companies";
import Request from "./pages/Request/Request";
import Products from "./pages/Products/Products";
import Login from "./pages/Login/Login";
import Tiers from "./pages/Tiers/Tiers";

function Layout() {
  const location = useLocation();
  const hideNav = location.pathname === "/login"; // 👈 لو صفحة اللوجين أخفي النـاف بار
  const user_token = localStorage.getItem("SGI_TOKEN");
  return (
    <div style={{ display: "flex" }}>
      {!hideNav && <SideNav />}

      <div style={{ flex: 1 }}>
        {!hideNav && <TopNav />}

        <Routes>
          <Route
            path="/"
            element={user_token ? <Home /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/brands"
            element={user_token ? <Brand /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/companies"
            element={
              user_token ? <Companies /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/requests"
            element={
              user_token ? <Request /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/products"
            element={
              user_token ? <Products /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/Tiers"
            element={user_token ? <Tiers /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/login"
            element={!user_token ? <Login /> : <Navigate to="/" replace />}
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
