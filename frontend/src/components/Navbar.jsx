import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Layout, Button, Typography } from "antd";
import CreateEditAdModal from "./CreateEditAdModal";
import "../styles/Navbar.css";

const { Header } = Layout;
const { Text } = Typography;

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <Header className="navbar-header">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            Advertisements
          </Link>

          <div className="navbar-actions">
            {auth.token ? (
              <>
                <Text className="navbar-text">Hi, {auth.username}</Text>
                <Button type="primary" onClick={() => setShowCreateModal(true)}>
                  Add advertisements
                </Button>
                <Button danger onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => navigate("/login")}>Login</Button>
                <Button type="primary" onClick={() => navigate("/register")}>
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
      </Header>

      {showCreateModal && (
        <CreateEditAdModal
          visible={true}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </>
  );
};

export default Navbar;
