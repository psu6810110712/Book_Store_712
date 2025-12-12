import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form, Input, InputNumber, Select, Card, Row, Col, message, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from './contexts/LanguageContext';

const URL_BOOK = "/api/book";
const URL_CATEGORY = "/api/book-category";

export default function EditBookPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [form] = Form.useForm();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingBook, setFetchingBook] = useState(true);
    const { t } = useLanguage();

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
            message.error(t('error'));
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
            message.error(t('error'));
            navigate('/books');
        } finally {
            setFetchingBook(false);
        }
    };

    const onFinish = async (values) => {
        try {
            setLoading(true);
            await axios.patch(`${URL_BOOK}/${id}`, values);
            message.success(t('success'));
            navigate('/books');
        } catch (err) {
            console.error(err);
            message.error(t('error'));
        } finally {
            setLoading(false);
        }
    };

    if (fetchingBook) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Spin size="large" tip={t('loading')} />
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
                {t('backToBooks')}
            </Button>

            <Card title={`✏️ ${t('editBook')}`} bordered={false}>
                <Form form={form} layout="vertical" onFinish={onFinish}>

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

                    <Form.Item style={{ textAlign: 'right', marginTop: '24px' }}>
                        <Button onClick={() => navigate('/books')} style={{ marginRight: '8px' }}>
                            {t('cancel')}
                        </Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            {t('save')}
                        </Button>
                    </Form.Item>

                </Form>
            </Card>
        </div>
    );
}
