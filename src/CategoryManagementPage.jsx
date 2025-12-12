import { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, message, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useLanguage } from './contexts/LanguageContext';

const URL_CATEGORY = "/api/book-category";

export default function CategoryManagementPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [form] = Form.useForm();
    const { t } = useLanguage();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await axios.get(URL_CATEGORY);
            setCategories(response.data);
        } catch (err) {
            console.error(err);
            message.error(t('error'));
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingCategory(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        form.setFieldsValue({ name: category.name });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${URL_CATEGORY}/${id}`);
            message.success(t('success'));
            fetchCategories();
        } catch (err) {
            console.error(err);
            message.error(t('categoryInUse'));
        }
    };

    const handleSubmit = async (values) => {
        try {
            if (editingCategory) {
                // Update
                await axios.patch(`${URL_CATEGORY}/${editingCategory.id}`, values);
                message.success(t('success'));
            } else {
                // Create
                await axios.post(URL_CATEGORY, values);
                message.success(t('success'));
            }
            setIsModalOpen(false);
            form.resetFields();
            fetchCategories();
        } catch (err) {
            console.error(err);
            message.error(t('error'));
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: t('categoryName'),
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: t('createdAt'),
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: t('actions'),
            key: 'actions',
            width: 200,
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        size="small"
                    >
                        {t('edit')}
                    </Button>
                    <Popconfirm
                        title={t('deleteCategory')}
                        description={t('categoryInUse')}
                        onConfirm={() => handleDelete(record.id)}
                        okText={t('yes')}
                        cancelText={t('no')}
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            icon={<DeleteOutlined />}
                            danger
                            size="small"
                        >
                            {t('delete')}
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Card
                title={`📂 ${t('categoryManagement')}`}
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                    >
                        {t('addCategory')}
                    </Button>
                }
            >
                <Table
                    rowKey="id"
                    dataSource={categories}
                    columns={columns}
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            <Modal
                title={editingCategory ? t('editCategoryTitle') : t('addCategoryTitle')}
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    form.resetFields();
                }}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="name"
                        label={t('categoryName')}
                        rules={[
                            { required: true, message: t('enterUsername') }, // Reusing 'Please enter...' pattern or just error
                            { min: 2, message: 'Name must be at least 2 characters' }
                        ]}
                    >
                        <Input placeholder={t('categoryName')} />
                    </Form.Item>

                    <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                        <Button onClick={() => setIsModalOpen(false)} style={{ marginRight: '8px' }}>
                            {t('cancel')}
                        </Button>
                        <Button type="primary" htmlType="submit">
                            {editingCategory ? t('update') : t('create')}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
