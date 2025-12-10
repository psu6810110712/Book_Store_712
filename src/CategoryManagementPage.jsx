import { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, message, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const URL_CATEGORY = "/api/book-category";

export default function CategoryManagementPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [form] = Form.useForm();

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
            message.error('Failed to load categories');
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
            message.success('Category deleted successfully');
            fetchCategories();
        } catch (err) {
            console.error(err);
            message.error('Failed to delete category. It may be in use.');
        }
    };

    const handleSubmit = async (values) => {
        try {
            if (editingCategory) {
                // Update
                await axios.patch(`${URL_CATEGORY}/${editingCategory.id}`, values);
                message.success('Category updated successfully');
            } else {
                // Create
                await axios.post(URL_CATEGORY, values);
                message.success('Category created successfully');
            }
            setIsModalOpen(false);
            form.resetFields();
            fetchCategories();
        } catch (err) {
            console.error(err);
            message.error(`Failed to ${editingCategory ? 'update' : 'create'} category`);
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
            title: 'Category Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 150,
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        size="small"
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete category?"
                        description="This will affect books in this category."
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            icon={<DeleteOutlined />}
                            danger
                            size="small"
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Card
                title="📂 Category Management"
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                    >
                        Add Category
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
                title={editingCategory ? "Edit Category" : "Add New Category"}
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
                        label="Category Name"
                        rules={[
                            { required: true, message: 'Please enter category name' },
                            { min: 2, message: 'Name must be at least 2 characters' }
                        ]}
                    >
                        <Input placeholder="Enter category name" />
                    </Form.Item>

                    <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                        <Button onClick={() => setIsModalOpen(false)} style={{ marginRight: '8px' }}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit">
                            {editingCategory ? 'Update' : 'Create'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
