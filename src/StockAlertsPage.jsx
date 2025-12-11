import { useState, useEffect } from 'react';
import { Card, Table, Tag, Alert, Spin, Button, InputNumber, Modal, message, Space } from 'antd';
import { WarningOutlined, ReloadOutlined, EditOutlined, CheckCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useLanguage } from './contexts/LanguageContext';

export default function StockAlertsPage() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [restockModal, setRestockModal] = useState({ visible: false, book: null, quantity: 0 });
    const { t } = useLanguage();

    const STOCK_THRESHOLD = 10; // Alert when stock < 10

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/book');
            setBooks(response.data);
        } catch (error) {
            console.error('Error fetching books:', error);
            message.error('Failed to load books');
        } finally {
            setLoading(false);
        }
    };

    const handleRestock = async () => {
        if (!restockModal.book || restockModal.quantity <= 0) {
            message.warning('Please enter a valid quantity');
            return;
        }

        try {
            const newStock = restockModal.book.stock + restockModal.quantity;
            await axios.patch(`/api/book/${restockModal.book.id}`, {
                stock: newStock
            });

            message.success(`Restocked ${restockModal.quantity} units successfully!`);
            setRestockModal({ visible: false, book: null, quantity: 0 });
            fetchBooks();
        } catch (error) {
            console.error('Error restocking:', error);
            message.error('Failed to restock');
        }
    };

    // Filter low stock items
    const lowStockBooks = books.filter(book => book.stock < STOCK_THRESHOLD);
    const criticalStockBooks = books.filter(book => book.stock === 0);

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            width: '30%',
            sorter: (a, b) => a.title.localeCompare(b.title),
        },
        {
            title: 'Author',
            dataIndex: 'author',
            key: 'author',
            width: '20%',
        },
        {
            title: 'Category',
            dataIndex: 'book_category_name',
            key: 'category',
            width: '15%',
            render: (category) => <Tag color="blue">{category || 'N/A'}</Tag>,
        },
        {
            title: 'Current Stock',
            dataIndex: 'stock',
            key: 'stock',
            width: '15%',
            sorter: (a, b) => a.stock - b.stock,
            render: (stock) => (
                <Tag color={stock === 0 ? 'red' : stock < 5 ? 'orange' : 'gold'}>
                    {stock} {stock === 0 ? '(OUT OF STOCK)' : stock < 5 ? '(CRITICAL)' : '(LOW)'}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: '20%',
            render: (_, record) => (
                <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => setRestockModal({ visible: true, book: record, quantity: 10 })}
                >
                    Restock
                </Button>
            ),
        },
    ];

    return (
        <div>
            <Card
                title={
                    <Space>
                        <WarningOutlined style={{ color: '#ff4d4f' }} />
                        <span>Stock Alerts - Low Inventory</span>
                    </Space>
                }
                extra={
                    <Button icon={<ReloadOutlined />} onClick={fetchBooks} loading={loading}>
                        Refresh
                    </Button>
                }
            >
                {/* Summary Alerts */}
                <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }} size="middle">
                    {criticalStockBooks.length > 0 && (
                        <Alert
                            message={`🚨 Critical: ${criticalStockBooks.length} items OUT OF STOCK`}
                            description="Immediate action required!"
                            type="error"
                            showIcon
                        />
                    )}
                    {lowStockBooks.length > 0 && (
                        <Alert
                            message={`⚠️ Warning: ${lowStockBooks.length} items with low stock (< ${STOCK_THRESHOLD} units)`}
                            description="Consider restocking soon."
                            type="warning"
                            showIcon
                        />
                    )}
                    {lowStockBooks.length === 0 && (
                        <Alert
                            message="✅ All stock levels are healthy!"
                            type="success"
                            showIcon
                            icon={<CheckCircleOutlined />}
                        />
                    )}
                </Space>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: 40 }}>
                        <Spin size="large" />
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        dataSource={lowStockBooks}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: 800 }}
                    />
                )}
            </Card>

            {/* Restock Modal */}
            <Modal
                title={`Restock: ${restockModal.book?.title}`}
                open={restockModal.visible}
                onOk={handleRestock}
                onCancel={() => setRestockModal({ visible: false, book: null, quantity: 0 })}
                okText="Confirm Restock"
            >
                <div style={{ marginBottom: 16 }}>
                    <p><strong>Current Stock:</strong> {restockModal.book?.stock} units</p>
                    <p><strong>Add Quantity:</strong></p>
                    <InputNumber
                        min={1}
                        value={restockModal.quantity}
                        onChange={(value) => setRestockModal({ ...restockModal, quantity: value })}
                        style={{ width: '100%' }}
                    />
                    <p style={{ marginTop: 8 }}>
                        <strong>New Stock:</strong> {(restockModal.book?.stock || 0) + (restockModal.quantity || 0)} units
                    </p>
                </div>
            </Modal>
        </div>
    );
}
