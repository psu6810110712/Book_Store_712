import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form, Input, InputNumber, Select, Card, Row, Col, message, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import axios from 'axios';

const URL_BOOK = "/api/book";
const URL_CATEGORY = "/api/book-category";

export default function EditBookPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [form] = Form.useForm();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingBook, setFetchingBook] = useState(true);

    useEffect(() => {
        fetchCategories();
        fetchBook();
    }, [id]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(URL_CATEGORY);
            setCategories(response.data.map(cat => ({ label: cat.name, value: cat.id })));
        } catch (err) {
            console.error(err);
            message.error('Failed to load categories');
        }
    };

    const fetchBook = async () => {
        try {
            setFetchingBook(true);
            const response = await axios.get(`${URL_BOOK}/${id}`);
            const book = response.data;

            form.setFieldsValue({
                title: book.title,
                author: book.author,
                description: book.description,
                price: book.price,
                stock: book.stock,
                isbn: book.isbn,
                coverUrl: book.coverUrl,
                categoryId: book.category?.id,
            });
        } catch (err) {
            console.error(err);
            message.error('Failed to load book details');
            navigate('/books');
        } finally {
            setFetchingBook(false);
        }
    };

    const onFinish = async (values) => {
        try {
            setLoading(true);
            await axios.patch(`${URL_BOOK}/${id}`, values);
            message.success('Book updated successfully!');
            navigate('/books');
        } catch (err) {
            console.error(err);
            message.error('Failed to update book');
        } finally {
            setLoading(false);
        }
    };

    if (fetchingBook) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Spin size="large" tip="Loading book details..." />
            </div>
        );
    }

    return (
        <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
            <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/books')}
                style={{ marginBottom: '16px' }}
            >
                Back to Books
            </Button>

            <Card title="✏️ Edit Book" bordered={false}>
                <Form form={form} layout="vertical" onFinish={onFinish}>

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

                    <Form.Item style={{ textAlign: 'right', marginTop: '24px' }}>
                        <Button onClick={() => navigate('/books')} style={{ marginRight: '8px' }}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Save Changes
                        </Button>
                    </Form.Item>

                </Form>
            </Card>
        </div>
    );
}
