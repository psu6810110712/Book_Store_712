import { useState, useEffect } from 'react';
import LoginScreen from './LoginScreen';
import BookScreen from './BookScreen';
import axios from 'axios';
import { Layout, Menu, theme, Modal, Button, Tooltip } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

axios.defaults.baseURL = "http://localhost:3000";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        axios.defaults.headers.common = { 'Authorization': `bearer ${token}` };
        setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setIsLoggedIn(false);
  };

  const showLogoutConfirm = () => {
    Modal.confirm({
      title: 'Confirm Logout',
      content: 'Are you sure you want to log out?',
      okText: 'Yes, Logout',
      cancelText: 'Cancel',
      okType: 'danger',
      onOk() {
        handleLogout();
      },
    });
  };

  const menuItems = [
    { key: 'home', label: 'Book Store' },
  ];

  return (
    <Layout className="layout" style={{ minHeight: '100vh', width: '100vw' }}>
      
      {isLoggedIn && (
        <Header style={{ display: 'flex', alignItems: 'center', padding: '0 24px', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div className="demo-logo" style={{ color: 'white', marginRight: '24px', fontWeight: 'bold', fontSize: '18px', whiteSpace: 'nowrap' }}>
                  My Shop
              </div>
              <Menu
                  theme="dark"
                  mode="horizontal"
                  defaultSelectedKeys={['home']}
                  items={menuItems}
                  style={{ flex: 1, minWidth: 0 }}
              />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
              <Button shape="circle" icon={<UserOutlined />} />
              <Tooltip title="Logout">
                  <Button 
                      type="primary" 
                      danger 
                      shape="circle" 
                      icon={<LogoutOutlined />} 
                      onClick={showLogoutConfirm} 
                  />
              </Tooltip>
          </div>
        </Header>
      )}
      
      <Content style={{ 
          padding: isLoggedIn ? '24px 50px' : '0', 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: isLoggedIn ? 'flex-start' : 'center',
          alignItems: 'center',
          flex: 1 
      }}>
        
        {isLoggedIn ? (
            <div style={{ 
                background: colorBgContainer, 
                padding: 24, 
                borderRadius: 8, 
                width: '100%', 
                maxWidth: '1200px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
                <BookScreen />
            </div>
        ) : (
            <div style={{ width: '100%', maxWidth: '400px' }}> 
                <LoginScreen onLoginSuccess={handleLoginSuccess} />
            </div>
        )}

      </Content>
      
      {isLoggedIn && (
        <Footer style={{ textAlign: 'center' }}>
          Book Store ©2025 Created with Ant Design
        </Footer>
      )}
    </Layout>
  );
}

export default App;