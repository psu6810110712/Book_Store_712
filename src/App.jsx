import { useState, useEffect } from 'react';
import LoginScreen from './LoginScreen';
import BookScreen from './BookScreen';
import DashboardScreen from './DashboardScreen';
import axios from 'axios';
// 1. เปลี่ยน Modal เป็น Popconfirm
import { Layout, Menu, theme, Button, Tooltip, Popconfirm } from 'antd'; 
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

axios.defaults.baseURL = "http://localhost:3000";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('home'); 

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
    setCurrentScreen('home'); 
  };

  // ลบฟังก์ชัน showLogoutConfirm ออกแล้ว เพราะไปใช้ใน JSX โดยตรง

  const menuItems = [
    { key: 'home', label: 'Book Store', onClick: () => setCurrentScreen('home') },
    { key: 'dashboard', label: 'Dashboard', onClick: () => setCurrentScreen('dashboard') },
  ];

  return (
    <Layout className="layout" style={{ minHeight: '100vh', width: '100%' }}>
      
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
                  selectedKeys={[currentScreen]}
                  items={menuItems}
                  style={{ flex: 1, minWidth: 0 }}
              />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
              <Button shape="circle" icon={<UserOutlined />} />
              
              {/* 2. ใช้ Popconfirm ครอบปุ่ม Logout */}
              <Popconfirm
                title="Confirm Logout"
                description="Are you sure to log out?"
                onConfirm={handleLogout} // เรียกฟังก์ชัน Logout เมื่อกด Yes
                placement="bottomRight"  // ให้กล่องโผล่ด้านล่างขวาของปุ่ม
                okText="Yes"
                cancelText="No"
                okButtonProps={{ danger: true }} // ให้ปุ่ม Yes เป็นสีแดง
              >
                  <Tooltip title="Logout">
                      <Button 
                          type="primary" 
                          danger 
                          shape="circle" 
                          icon={<LogoutOutlined />} 
                      />
                  </Tooltip>
              </Popconfirm>

          </div>
        </Header>
      )}
      
      <Content style={{ 
          padding: isLoggedIn ? '24px 20px' : '0', 
          display: 'flex', 
          flexDirection: 'column',
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
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                marginBottom: '20px',
                overflowX: 'hidden' 
            }}>
                {currentScreen === 'home' ? <BookScreen /> : <DashboardScreen />}
            </div>
        ) : (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                width: '100%',
                flex: 1 
            }}>
                <div style={{ width: '100%', maxWidth: '400px' }}>
                    <LoginScreen onLoginSuccess={handleLoginSuccess} />
                </div>
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