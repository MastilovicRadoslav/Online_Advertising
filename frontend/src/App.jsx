import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import AdDetailsPage from "./pages/AdDetailsPage.jsx";
import Navbar from "./components/Navbar.jsx";
import { Layout } from "antd";

const App = () => {
  return (
    <>
      <Navbar />
      <Layout style={{ marginTop: 64, minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px" }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/ads/:id" element={<AdDetailsPage />} />
          </Routes>
        </div>
      </Layout>
    </>
  );
};

export default App;
