import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, InputNumber, Select, Card, Row, Col, message, Badge, Divider, Space, Alert } from 'antd';
import { ArrowLeftOutlined, PlusOutlined, CheckCircleOutlined, RocketOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import axios from 'axios';

const URL_BOOK = "/api/book";
const URL_CATEGORY = "/api/book-category";

export default function AddBookPage() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addedBooks, setAddedBooks] = useState([]); // Track added books

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(URL_CATEGORY);
            setCategories(response.data.map(cat => ({ label: cat.name, value: cat.id })));
        } catch (err) {
            console.error(err);
            message.error('Failed to load categories');
        }
    };

    // Save and continue adding more books
    const handleSaveAndContinue = async (values) => {
        try {
            setLoading(true);
            await axios.post(URL_BOOK, values);
            message.success(`✅ "${values.title}" added successfully! You can add more.`);

            // Track added book
            setAddedBooks(prev => [...prev, { title: values.title, author: values.author }]);

            // Clear form for next entry
            form.resetFields();
        } catch (err) {
            console.error(err);
            message.error('Failed to add book');
        } finally {
            setLoading(false);
        }
    };

    // Deploy/Finish - go back to books
    const handleDeploy = () => {
        if (addedBooks.length > 0) {
            message.success(`🚀 ${addedBooks.length} book(s) deployed successfully!`);
        }
        navigate('/books');
    };

    return (
        <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/books')}
                >
                    Back to Books
                </Button>

                {/* Deploy button with badge */}
                <Badge count={addedBooks.length} showZero={false}>
                    <Button
                        type="primary"
                        icon={<RocketOutlined />}
                        onClick={handleDeploy}
                        style={{
                            background: addedBooks.length > 0 ? '#52c41a' : undefined,
                            borderColor: addedBooks.length > 0 ? '#52c41a' : undefined
                        }}
                    >
                        {addedBooks.length > 0 ? `Deploy ${addedBooks.length} Book(s)` : 'Deploy & Exit'}
                    </Button>
                </Badge>
            </Row>

            {/* Show added books summary */}
            {addedBooks.length > 0 && (
                <Alert
                    message={`📚 ${addedBooks.length} book(s) added in this session`}
                    description={
                        <Space wrap size="small">
                            {addedBooks.map((book, index) => (
                                <Badge
                                    key={index}
                                    status="success"
                                    text={`${book.title} by ${book.author}`}
                                />
                            ))}
                        </Space>
                    }
                    type="success"
                    showIcon
                    icon={<CheckCircleOutlined />}
                    style={{ marginBottom: '16px' }}
                />
            )}

            <Card title="📚 Add New Book" bordered={false}>
                <Form form={form} layout="vertical" onFinish={handleSaveAndContinue}>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter title' }]}>
                                <Input placeholder="Enter title" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="author" label="Author" rules={[{ required: true, message: 'Please enter author' }]}>
                                <Input placeholder="Enter author" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="description" label="Description">
                        <Input.TextArea rows={3} placeholder="Brief description..." />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please enter price' }]}>
                                <InputNumber style={{ width: '100%' }} min={0} prefix="$" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="stock" label="Stock" rules={[{ required: true, message: 'Please enter stock' }]}>
                                <InputNumber style={{ width: '100%' }} min={0} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="categoryId" label="Category" rules={[{ required: true, message: 'Please select category' }]}>
                                <Select
                                    allowClear
                                    options={categories}
                                    placeholder="Select category"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="isbn" label="ISBN">
                        <Input placeholder="Enter ISBN (optional)" />
                    </Form.Item>

                    <Form.Item name="coverUrl" label="Cover Image URL">
                        <Input placeholder="e.g. https://example.com/image.jpg" />
                    </Form.Item>

                    <Divider />

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Row justify="space-between">
                            <Button onClick={() => navigate('/books')}>
                                Cancel
                            </Button>
                            <Space>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    icon={<PlusOutlined />}
                                >
                                    Save & Add Another
                                </Button>
                                <Button
                                    type="primary"
                                    icon={<RocketOutlined />}
                                    onClick={handleDeploy}
                                    style={{
                                        background: '#52c41a',
                                        borderColor: '#52c41a'
                                    }}
                                >
                                    Deploy All
                                </Button>
                            </Space>
                        </Row>
                    </Form.Item>

                </Form>
            </Card>
        </div>
    );
}
