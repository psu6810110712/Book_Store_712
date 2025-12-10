import { useState, useEffect } from 'react';
import LoginScreen from './LoginScreen';
import BookScreen from './BookScreen';
import DashboardScreen from './DashboardScreen';
import axios from 'axios';
// 1. เพิ่ม ConfigProvider, Switch และ icon พระอาทิตย์/พระจันทร์
import { Layout, Menu, theme, Button, Tooltip, Popconfirm, ConfigProvider, Switch } from 'antd';
import { LogoutOutlined, UserOutlined, ReadOutlined, BulbOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

axios.defaults.baseURL = "http://localhost:3000";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('home');

  // 2. State สำหรับ Dark Mode (เริ่มต้นเป็น False = โหมดสว่าง)
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common = { 'Authorization': `bearer ${token}` };
      setIsLoggedIn(true);
    }
  }, []);

  // 3. ฟังก์ชันสลับโหมด และอัปเดต Attribute ให้ CSS รู้ตัว
  const toggleTheme = (checked) => {
    setIsDarkMode(checked);
    // ตั้งค่า data-theme ให้ body เพื่อให้ Scrollbar ใน index.css เปลี่ยนสีตาม
    if (checked) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  const handleLoginSuccess = () => { setIsLoggedIn(true); };

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setIsLoggedIn(false);
    setCurrentScreen('home');
  };

  const menuItems = [
    { key: 'home', icon: <ReadOutlined />, label: 'Book Store', onClick: () => setCurrentScreen('home') },
    { key: 'dashboard', icon: <UserOutlined />, label: 'Dashboard', onClick: () => setCurrentScreen('dashboard') },
  ];

  // กำหนดสีพื้นหลังของ Content Box ตามโหมด (เพราะเราไม่ได้แยก Component ย่อย เลยใช้ตัวแปรช่วย)
  const contentBg = isDarkMode ? '#141414' : '#ffffff';

  return (
    // 4. ครอบด้วย ConfigProvider เพื่อเปลี่ยนธีม Ant Design ทั้งหมด
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          // ปรับสี Primary ได้ถ้าต้องการ
          colorPrimary: '#1890ff',
        }
      }}
    >
      <Layout className="layout" style={{ minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
        {isLoggedIn && (
          <Header style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            justifyContent: 'space-between',
            // ปรับสี Header ตามโหมด
            background: isDarkMode ? '#001529' : '#ffffff',
            borderBottom: isDarkMode ? 'none' : '1px solid #f0f0f0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div className="demo-logo" style={{
                color: isDarkMode ? 'white' : '#333', // สีตัวหนังสือโลโก้
                marginRight: '24px', fontWeight: '600', fontSize: '18px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '8px'
              }}>
                <ReadOutlined style={{ color: '#1890ff' }} /> My Shop
              </div>

              <Menu
                theme={isDarkMode ? "dark" : "light"} // เปลี่ยนธีมเมนู
                mode="horizontal"
                defaultSelectedKeys={['home']}
                selectedKeys={[currentScreen]}
                items={menuItems}
                style={{ flex: 1, minWidth: 0, borderBottom: 'none', background: 'transparent' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              {/* 5. ปุ่มสวิตช์ Dark Mode */}
              <Switch
                checkedChildren={<MoonOutlined />}
                unCheckedChildren={<SunOutlined />}
                checked={isDarkMode}
                onChange={toggleTheme}
              />

              <div style={{ display: 'flex', gap: '8px' }}>
                <Button type="text" shape="circle" icon={<UserOutlined style={{ color: isDarkMode ? '#fff' : '#555' }} />} />

                <Popconfirm
                  title="Confirm Logout"
                  description="Are you sure to log out?"
                  onConfirm={handleLogout}
                  placement="bottomRight"
                  okText="Yes"
                  cancelText="No"
                  okButtonProps={{ danger: true }}
                >
                  <Tooltip title="Logout">
                    <Button
                      type="text"
                      danger
                      shape="circle"
                      icon={<LogoutOutlined />}
                    />
                  </Tooltip>
                </Popconfirm>
              </div>
            </div>
          </Header>
        )}

        <Content style={{
          padding: isLoggedIn ? '24px' : '0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flex: 1,
          background: '#f5f7fa',

          /* 1. เพิ่มบรรทัดนี้: เพื่อจำกัดความสูงของพื้นที่เนื้อหาไม่ให้เกินหน้าจอ */
          height: 'calc(100vh - 64px)', // 64px คือความสูงโดยประมาณของ Header
          overflow: 'hidden' // ซ่อนส่วนเกินของ Content หลัก
        }}>

          {isLoggedIn ? (
            <div style={{
              background: '#fff',
              padding: '24px',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '1600px',
              border: '1px solid #eee',

              /* 2. แก้ไขส่วนนี้: กำหนดให้กล่องนี้ยืดเต็มพื้นที่ที่เหลือ และมี Scrollbar ของตัวเอง */
              height: '100%',
              overflowX: 'hidden',
              overflowY: 'auto',
              boxSizing: 'border-box'
            }}>
              {currentScreen === 'home' ? <BookScreen /> : <DashboardScreen />}
            </div>
          ) : (
            // ... ส่วน Login เหมือนเดิม ...
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', flex: 1 }}>
              <div style={{ width: '100%', maxWidth: '400px' }}>
                <LoginScreen onLoginSuccess={handleLoginSuccess} />
              </div>
            </div>
          )}

        </Content>

        {isLoggedIn && (
          <Footer style={{ textAlign: 'center', background: 'transparent', color: '#888' }}>
            Book Store ©2025 Created with Ant Design
          </Footer>
        )}
      </Layout>
    </ConfigProvider >
  );
}

export default App;