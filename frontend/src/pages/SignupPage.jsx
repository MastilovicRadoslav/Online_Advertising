import { Form, Input, Button, message } from 'antd'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './AuthPages.css'
import FormItem from 'antd/es/form/FormItem'
import Password from 'antd/es/input/Password'

const SignupPage = () => {

    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, values)
            message.success('Registracija uspješna! Možete se prijaviti.')
            navigate('./login');
        } catch (err) {
            message.error(err.response?.data?.message || 'Greška pri registraciji.')
        }
    }


    return (
        <div className="auth-container">
            <h2 className="auth-title">Registracija</h2>
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item
                    name="username"
                    label="Korisničko ime"
                    rules={[{ required: true, message: 'Unesite korisničko ime!' }]}
                >
                    <Input />

                </Form.Item>

                <FormItem
                    name="password"
                    label="Šifra"
                    rules={[{ required: true, message: 'Unesite šifru!' }]}
                >
                    <Input.Password />
                </FormItem>

                <FormItem
                    name="phone"
                    label="Broj telefona"
                    rules={[{ required: true, message: 'Unesite broj telefona!' }]}
                >
                    <Input />

                </FormItem>

                <FormItem>
                    <Button type="primary" htmlType="submit" block>
                        Registruj se
                    </Button>
                </FormItem>
            </Form>
        </div>
    )
}


export default SignupPage


