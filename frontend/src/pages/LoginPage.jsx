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

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login", {
        username: values.username,
        password: values.password,
      });

      const { token, username, userId } = response.data;
      login(token, username, userId);
      message.success("Uspješan login!");
      navigate("/");
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || "Greška pri loginu.");
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
      </Card>
    </div>
  );
};

export default LoginPage;
