import { useState } from 'react';
import { Button, Form, Input, Alert, Checkbox } from 'antd'; // 1. Import Checkbox
import axios from 'axios'
const URL_AUTH = "/api/auth/login"

export default function LoginScreen(props) {
    const [isLoading, setIsLoading] = useState(false)
    const [errMsg, setErrMsg] = useState(null)

    const handleLogin = async (formData) => {
        try {
            setIsLoading(true)
            setErrMsg(null)

            // 1. แยก remember ออกมาจากข้อมูลที่จะส่งให้ Server
            const { remember, ...loginData } = formData; 
            // ตอนนี้ loginData จะเหลือแค่ { username, password }

            // 2. ส่งเฉพาะ loginData ไปที่ Server
            const response = await axios.post(URL_AUTH, loginData) 
            
            const token = response.data.access_token
            axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }
            
            // 3. ใช้ค่า remember ที่แยกออกมา ตัดสินใจว่าจะเก็บ Token ไหม
            if (remember) {
                localStorage.setItem('token', token);
            }

            props.onLoginSuccess();
        } catch (err) {
            console.log(err)
            // เช็คว่า Error มาจาก Server หรือไม่
            if (err.response && err.response.data && err.response.data.message) {
                 // ถ้าเป็น Array (เช่น validation error หลายตัว) ให้ดึงตัวแรกมาโชว์
                 const msg = Array.isArray(err.response.data.message) 
                    ? err.response.data.message[0] 
                    : err.response.data.message;
                 setErrMsg(msg);
            } else {
                 setErrMsg(err.message)
            }
        } finally { setIsLoading(false) }
    }
    return (
        <Form
            onFinish={handleLogin}
            autoComplete="off"
            style={{ width: 350, margin: '50px auto', padding: '20px', border: '1px solid #d9d9d9', borderRadius: '4px' }}>
            
            <h3>Book Store Login</h3>
            
            {errMsg &&
                <Form.Item>
                    <Alert message={errMsg} type="error" showIcon />
                </Form.Item>
            }
            
            <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}>
                <Input />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}>
                <Input.Password />
            </Form.Item>

            {/* 3. เพิ่ม Checkbox Remember Me */}
            <Form.Item name="remember" valuePropName="checked">
                <Checkbox>Remember me</Checkbox>
            </Form.Item>
            
            <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                <Button
                    type="primary"
                    htmlType="submit" 
                    loading={isLoading}>
                    Login
                </Button>
            </Form.Item>
        </Form>
    )
}