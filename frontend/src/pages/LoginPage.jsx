import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Card, Form, Input, Button, Typography, message } from "antd";
import api from "../services/api";
import "../styles/LoginPage.css";

const { Title, Text } = Typography;

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const onFinish = async (values) => {
    setLoading(true);
    setLoginError(""); // resetuj staru grešku

    try {
      const response = await api.post("/auth/login", {
        username: values.username,
        password: values.password,
      });

      const { token, username, userId } = response.data;
      login(token, username, userId);
      message.success("Login successful!");
      navigate("/");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Login failed. Please try again.";
      setLoginError(errorMsg);
      message.error(errorMsg, 3); // prikaz popup poruke
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <Card className="login-card">
        <Title level={2} className="login-title">Login</Title>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Enter a username" }]}
          >
            <Input placeholder="Enter a username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Enter a password" }]}
          >
            <Input.Password placeholder="Enter a password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Confirm
            </Button>
          </Form.Item>
        </Form>

        {loginError && (
          <Text type="danger" style={{ display: "block", marginTop: "10px" }}>
            {loginError}
          </Text>
        )}
      </Card>
    </div>
  );
};

export default LoginPage;
