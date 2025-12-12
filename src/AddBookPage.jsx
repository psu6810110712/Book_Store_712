import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, InputNumber, Select, Card, Row, Col, message, Badge, Divider, Space, Alert } from 'antd';
import { ArrowLeftOutlined, PlusOutlined, CheckCircleOutlined, RocketOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from './contexts/LanguageContext';

const URL_BOOK = "/api/book";
const URL_CATEGORY = "/api/book-category";

export default function AddBookPage() {
    const navigate = useNavigate();
    const { t } = useLanguage();
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
            message.error(t('error'));
        }
    };

    // Save and continue adding more books
    const handleSaveAndContinue = async (values) => {
        try {
            setLoading(true);
            await axios.post(URL_BOOK, values);
            message.success(`✅ "${values.title}" ${t('success')}!`);

            // Track added book
            setAddedBooks(prev => [...prev, { title: values.title, author: values.author }]);

            // Clear form for next entry
            form.resetFields();
        } catch (err) {
            console.error(err);
            message.error(t('error'));
        } finally {
            setLoading(false);
        }
    };

    // Deploy/Finish - go back to books
    const handleDeploy = () => {
        if (addedBooks.length > 0) {
            message.success(`🚀 ${addedBooks.length} ${t('booksAddedSession')}`);
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
                    {t('backToBooks')}
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
                        {addedBooks.length > 0 ? `${t('deployBooks')} (${addedBooks.length})` : t('deployBooks')}
                    </Button>
                </Badge>
            </Row>

            {/* Show added books summary */}
            {addedBooks.length > 0 && (
                <Alert
                    message={`📚 ${addedBooks.length} ${t('booksAddedSession')}`}
                    description={
                        <Space wrap size="small">
                            {addedBooks.map((book, index) => (
                                <Badge
                                    key={index}
                                    status="success"
                                    text={`${book.title} ${t('author')} ${book.author}`}
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

            <Card title={`📚 ${t('addNewBook')}`} bordered={false}>
                <Form form={form} layout="vertical" onFinish={handleSaveAndContinue}>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="title" label={t('title')} rules={[{ required: true, message: `${t('title')} is required` }]}>
                                <Input placeholder={t('title')} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="author" label={t('author')} rules={[{ required: true, message: `${t('author')} is required` }]}>
                                <Input placeholder={t('author')} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="description" label={t('description')}>
                        <Input.TextArea rows={3} placeholder={t('description')} />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="price" label={t('price')} rules={[{ required: true, message: `${t('price')} is required` }]}>
                                <InputNumber style={{ width: '100%' }} min={0} prefix="$" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="stock" label={t('stock')} rules={[{ required: true, message: `${t('stock')} is required` }]}>
                                <InputNumber style={{ width: '100%' }} min={0} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="categoryId" label={t('category')} rules={[{ required: true, message: `${t('category')} is required` }]}>
                                <Select
                                    allowClear
                                    options={categories}
                                    placeholder={t('category')}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="isbn" label={t('isbn')}>
                        <Input placeholder={t('isbn')} />
                    </Form.Item>

                    <Form.Item name="coverUrl" label={`${t('cover')} URL`}>
                        <Input placeholder="URL" />
                    </Form.Item>

                    <Divider />

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Row justify="space-between">
                            <Button onClick={() => navigate('/books')}>
                                {t('cancel')}
                            </Button>
                            <Space>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    icon={<PlusOutlined />}
                                >
                                    {t('saveAndAddAnother')}
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
                                    {t('deployAll')}
                                </Button>
                            </Space>
                        </Row>
                    </Form.Item>

                </Form>
            </Card>
        </div>
    );
}
