import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginScreen from './LoginScreen';
import BookScreen from './BookScreen';
import DashboardScreen from './DashboardScreen';
import AddBookPage from './AddBookPage';
import EditBookPage from './EditBookPage';
import CategoryManagementPage from './CategoryManagementPage';
import BookRecommendationPage from './BookRecommendationPage';
import axios from 'axios';
import { Layout, Menu, theme, Button, Tooltip, Popconfirm, ConfigProvider, Switch } from 'antd';
import { LogoutOutlined, UserOutlined, ReadOutlined, BulbOutlined, MoonOutlined, SunOutlined, AppstoreOutlined, FolderOutlined, StarOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

axios.defaults.baseURL = "http://localhost:3000";

// Layout wrapper component that uses routing
function AppLayout() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentPath, setCurrentPath] = useState('/books');
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common = { 'Authorization': `bearer ${token}` };
            setIsLoggedIn(true);
        }
    }, []);

    const toggleTheme = (checked) => {
        setIsDarkMode(checked);
        if (checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    };

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        navigate('/books');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setIsLoggedIn(false);
        navigate('/login');
    };

    const menuItems = [
        { key: '/books', icon: <ReadOutlined />, label: 'Book Store', onClick: () => { navigate('/books'); setCurrentPath('/books'); } },
        { key: '/recommendations', icon: <StarOutlined />, label: 'Recommendations', onClick: () => { navigate('/recommendations'); setCurrentPath('/recommendations'); } },
        { key: '/dashboard', icon: <AppstoreOutlined />, label: 'Dashboard', onClick: () => { navigate('/dashboard'); setCurrentPath('/dashboard'); } },
        { key: '/categories', icon: <FolderOutlined />, label: 'Categories', onClick: () => { navigate('/categories'); setCurrentPath('/categories'); } },
    ];

    const contentBg = isDarkMode ? '#141414' : '#ffffff';

    if (!isLoggedIn) {
        return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <ConfigProvider
            theme={{
                algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: {
                    colorPrimary: '#1890ff',
                }
            }}
        >
            <Layout className="layout" style={{ minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
                <Header style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 24px',
                    justifyContent: 'space-between',
                    background: isDarkMode ? '#001529' : '#ffffff',
                    borderBottom: isDarkMode ? 'none' : '1px solid #f0f0f0',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <div className="demo-logo" style={{
                            color: isDarkMode ? 'white' : '#333',
                            marginRight: '24px', fontWeight: '600', fontSize: '18px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '8px'
                        }}>
                            <ReadOutlined style={{ color: '#1890ff' }} /> My Book Shop
                        </div>

                        <Menu
                            theme={isDarkMode ? "dark" : "light"}
                            mode="horizontal"
                            defaultSelectedKeys={['/books']}
                            selectedKeys={[currentPath]}
                            items={menuItems}
                            style={{ flex: 1, minWidth: 0, borderBottom: 'none', background: 'transparent' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
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

                <Content style={{
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flex: 1,
                    background: '#f5f7fa',
                    height: 'calc(100vh - 64px)',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        background: '#fff',
                        padding: '24px',
                        borderRadius: '12px',
                        width: '100%',
                        maxWidth: '1600px',
                        border: '1px solid #eee',
                        height: '100%',
                        overflowX: 'hidden',
                        overflowY: 'auto',
                        boxSizing: 'border-box'
                    }}>
                        <Routes>
                            <Route path="/books" element={<BookScreen />} />
                            <Route path="/books/add" element={<AddBookPage />} />
                            <Route path="/books/edit/:id" element={<EditBookPage />} />
                            <Route path="/recommendations" element={<BookRecommendationPage />} />
                            <Route path="/dashboard" element={<DashboardScreen />} />
                            <Route path="/categories" element={<CategoryManagementPage />} />
                            <Route path="*" element={<Navigate to="/books" replace />} />
                        </Routes>
                    </div>
                </Content>

                <Footer style={{ textAlign: 'center', background: 'transparent', color: '#888' }}>
                    Book Store ©2025 Created with Ant Design & React Router
                </Footer>
            </Layout>
        </ConfigProvider>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginScreen onLoginSuccess={() => window.location.href = '/books'} />} />
                <Route path="/*" element={<AppLayout />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
