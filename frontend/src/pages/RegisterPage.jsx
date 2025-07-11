import { useState } from "react";
import { Form, Input, Button, Typography, message, Card } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/RegisterPage.css";

const { Title } = Typography;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await api.post("/auth/register", {
        username: values.username,
        password: values.password,
        phone: values.phone,
      });

      message.success("Uspješna registracija! Možete se prijaviti.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || "Greška pri registraciji.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page-container">
      <Card className="register-card">
        <Title level={2} className="register-title">Registration</Title>

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

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Enter a phone" }]}
          >
            <Input placeholder="Enter a phone" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Confirm
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;
