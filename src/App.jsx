import { Routes, Route } from "react-router-dom";
import Home from "./components/home/Home.jsx";
import Login from "./components/login/Login.jsx";
import Dashboard from "./components/admin/Dashboard.jsx";
import Products from "./components/products/Products.jsx";
import ProductDetail from "./components/products/productDetail/ProductDetail.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import './app.css';

function App() {
  return (
    <div className="AppContainer">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
