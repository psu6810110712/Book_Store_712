import { useState } from 'react';
import { Button, Form, Input, Alert, Checkbox } from 'antd';
import axios from 'axios'
import { useLanguage } from './contexts/LanguageContext'; // Import useLanguage

const URL_AUTH = "/api/auth/login"

export default function LoginScreen(props) {
    const [isLoading, setIsLoading] = useState(false)
    const [errMsg, setErrMsg] = useState(null)
    const { t } = useLanguage(); // Use hook

    const handleLogin = async (formData) => {
        try {
            setIsLoading(true)
            setErrMsg(null)

            const { remember, ...loginData } = formData;
            const response = await axios.post(URL_AUTH, loginData)

            const token = response.data.access_token
            axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }

            if (remember) {
                localStorage.setItem('token', token);
            }

            props.onLoginSuccess();
        } catch (err) {
            console.log(err)
            if (err.response && err.response.data && err.response.data.message) {
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

            <h3 style={{ textAlign: 'center', marginBottom: '24px' }}>{t('loginTitle')}</h3>

            {errMsg &&
                <Form.Item>
                    <Alert message={errMsg} type="error" showIcon />
                </Form.Item>
            }

            <Form.Item
                label={t('username')}
                name="username"
                rules={[{ required: true, message: t('enterUsername') }]}>
                <Input placeholder={t('username')} />
            </Form.Item>

            <Form.Item
                label={t('password')}
                name="password"
                rules={[{ required: true, message: t('enterPassword') }]}>
                <Input.Password placeholder={t('password')} />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
                <Checkbox>{t('rememberMe')}</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
                <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={isLoading}>
                    {t('loginButton')}
                </Button>
            </Form.Item>
        </Form>
    )
}