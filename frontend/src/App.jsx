import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import AdDetailsPage from "./pages/AdDetailsPage.jsx";
import CreateEditAdPage from "./pages/CreateEditAdPage.jsx";
import Navbar from "./components/Navbar.jsx";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/ads/:id" element={<AdDetailsPage />} />
        <Route path="/create" element={<CreateEditAdPage />} />
        <Route path="/edit/:id" element={<CreateEditAdPage />} /> 
      </Routes>
    </>
  );
};

export default App;
