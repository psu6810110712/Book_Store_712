import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginScreen from './LoginScreen';
import BookScreen from './BookScreen';
import DashboardScreen from './DashboardScreen';
import AddBookPage from './AddBookPage';
import EditBookPage from './EditBookPage';
import CategoryManagementPage from './CategoryManagementPage';
import BookRecommendationPage from './BookRecommendationPage';
import StockAlertsPage from './StockAlertsPage';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import axios from 'axios';
import { Layout, Menu, theme, Button, Tooltip, Popconfirm, ConfigProvider, Switch, Dropdown, Space, Badge } from 'antd';
import { LogoutOutlined, UserOutlined, ReadOutlined, MoonOutlined, SunOutlined, AppstoreOutlined, FolderOutlined, StarOutlined, GlobalOutlined, SettingOutlined, WarningOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

axios.defaults.baseURL = "http://localhost:3000";

// Layout wrapper component that uses routing
function AppLayout() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentPath, setCurrentPath] = useState('/books');
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('dark-mode') === 'true';
    });

    const { language, toggleLanguage, t } = useLanguage();
    const [lowStockCount, setLowStockCount] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common = { 'Authorization': `bearer ${token}` };
            setIsLoggedIn(true);
        }

        // Apply saved dark mode
        if (isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }

        // Fetch low stock count
        fetchLowStockCount();
    }, []);

    const fetchLowStockCount = async () => {
        try {
            const response = await axios.get('/api/book');
            const lowStock = response.data.filter(book => book.stock < 10).length;
            setLowStockCount(lowStock);
        } catch (error) {
            console.error('Error fetching low stock count:', error);
        }
    };

    const toggleTheme = (checked) => {
        setIsDarkMode(checked);
        localStorage.setItem('dark-mode', checked);
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
        { key: '/books', icon: <ReadOutlined />, label: t('books'), onClick: () => { navigate('/books'); setCurrentPath('/books'); } },
        { key: '/stock-alerts', icon: <WarningOutlined />, label: 'Stock Alerts', onClick: () => { navigate('/stock-alerts'); setCurrentPath('/stock-alerts'); } },
        { key: '/dashboard', icon: <AppstoreOutlined />, label: t('dashboard'), onClick: () => { navigate('/dashboard'); setCurrentPath('/dashboard'); } },
        { key: '/recommendations', icon: <StarOutlined />, label: t('recommendations'), onClick: () => { navigate('/recommendations'); setCurrentPath('/recommendations'); } },
        { key: '/categories', icon: <FolderOutlined />, label: t('categories'), onClick: () => { navigate('/categories'); setCurrentPath('/categories'); } },
    ];

    // Settings dropdown menu
    const settingsMenuItems = [
        {
            key: 'language',
            icon: <GlobalOutlined />,
            label: (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: 150 }}>
                    <span>{t('language')}</span>
                    <Button
                        size="small"
                        type={language === 'en' ? 'primary' : 'default'}
                        onClick={(e) => { e.stopPropagation(); toggleLanguage(); }}
                        style={{ marginLeft: 8 }}
                    >
                        {language === 'en' ? 'EN' : 'TH'}
                    </Button>
                </div>
            ),
        },
        {
            key: 'theme',
            icon: isDarkMode ? <MoonOutlined /> : <SunOutlined />,
            label: (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: 150 }}>
                    <span>{t('darkMode')}</span>
                    <Switch
                        size="small"
                        checked={isDarkMode}
                        onChange={toggleTheme}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            ),
        },
    ];

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

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        {/* Low Stock Notification */}
                        <Tooltip title={`${lowStockCount} items low on stock`}>
                            <Badge count={lowStockCount} offset={[-5, 5]}>
                                <Button
                                    type="text"
                                    icon={<WarningOutlined style={{ color: lowStockCount > 0 ? '#ff4d4f' : (isDarkMode ? '#fff' : '#555') }} />}
                                    onClick={() => { navigate('/stock-alerts'); setCurrentPath('/stock-alerts'); }}
                                />
                            </Badge>
                        </Tooltip>

                        {/* Language indicator */}
                        <Button
                            type="text"
                            size="small"
                            onClick={toggleLanguage}
                            style={{
                                color: isDarkMode ? '#fff' : '#555',
                                fontSize: '14px'
                            }}
                        >
                            {language === 'en' ? 'EN' : 'TH'}
                        </Button>

                        {/* Settings Dropdown */}
                        <Dropdown
                            menu={{ items: settingsMenuItems }}
                            placement="bottomRight"
                            trigger={['click']}
                        >
                            <Button
                                type="text"
                                shape="circle"
                                icon={<SettingOutlined style={{ color: isDarkMode ? '#fff' : '#555' }} />}
                            />
                        </Dropdown>

                        {/* User & Logout */}
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Button type="text" shape="circle" icon={<UserOutlined style={{ color: isDarkMode ? '#fff' : '#555' }} />} />

                            <Popconfirm
                                title={t('logout')}
                                description={t('logoutConfirm')}
                                onConfirm={handleLogout}
                                placement="bottomRight"
                                okText={t('yes')}
                                cancelText={t('no')}
                                okButtonProps={{ danger: true }}
                            >
                                <Tooltip title={t('logout')}>
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
                    background: isDarkMode ? '#141414' : '#f5f7fa',
                    height: 'calc(100vh - 64px)',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        background: isDarkMode ? '#1f1f1f' : '#fff',
                        padding: '24px',
                        borderRadius: '12px',
                        width: '100%',
                        maxWidth: '1600px',
                        border: isDarkMode ? '1px solid #303030' : '1px solid #eee',
                        height: '100%',
                        overflowX: 'hidden',
                        overflowY: 'auto',
                        boxSizing: 'border-box'
                    }}>
                        <Routes>
                            <Route path="/books" element={<BookScreen />} />
                            <Route path="/books/add" element={<AddBookPage />} />
                            <Route path="/books/edit/:id" element={<EditBookPage />} />
                            <Route path="/stock-alerts" element={<StockAlertsPage />} />
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
        <LanguageProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginScreen onLoginSuccess={() => window.location.href = '/books'} />} />
                    <Route path="/*" element={<AppLayout />} />
                </Routes>
            </BrowserRouter>
        </LanguageProvider>
    );
}

export default App;
