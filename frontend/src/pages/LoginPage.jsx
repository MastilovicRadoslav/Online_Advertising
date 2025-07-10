import React from 'react'
import { Form, Input, Button, message } from 'antd'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './AuthPages.css'

const LoginPage = () => {
    const navigate = useNavigate()

    const onFinish = async (values) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, values)
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('username', res.data.username)
            message.success('Uspješno prijavljen!')
            navigate('/')
        } catch (err) {
            message.error(err.response?.data?.message || 'Greška pri loginu.')
        }
    }

    return (
        <div className="auth-container">
            <h2 className="auth-title">Prijava</h2>
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item
                    name="username"
                    label="Korisničko ime"
                    rules={[{ required: true, message: 'Unesite korisničko ime!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Šifra"
                    rules={[{ required: true, message: 'Unesite šifru!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Prijavi se
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default LoginPage
