import './App.css'
import { useState, useEffect } from 'react'
import { Divider, Spin, Select, Tag, Button, Modal, Card, Row, Col } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import BookList from './components/BookList'
import AddBook from './components/AddBook'
import EditBook from './components/EditBook'
import axios from 'axios'

axios.defaults.baseURL = "http://localhost:3000"
const URL_BOOK = "/api/book"
const URL_CATEGORY = "/api/book-category"

const getColorByName = (name) => {
    const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) { hash = name.charCodeAt(i) + ((hash << 5) - hash); }
    return colors[Math.abs(hash) % colors.length];
}

const tagRender = (props) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event) => { event.preventDefault(); event.stopPropagation(); };
    return (
        <Tag color={getColorByName(label)} onMouseDown={onPreventMouseDown} closable={closable} onClose={onClose} style={{ marginInlineEnd: 4 }}>
            {label}
        </Tag>
    );
};

function BookScreen() {
    const [totalAmount, setTotalAmount] = useState(0);
    const [bookData, setBookData] = useState([])
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [editItem, setEditItem] = useState(null);
    const [filterCategories, setFilterCategories] = useState([]);
    
    // 1. ตรวจสอบว่ามี State นี้อยู่
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const response = await axios.get(URL_BOOK);
            setBookData(response.data);
        } catch (err) { console.log(err) }
        finally { setLoading(false) }
    }
    const fetchCategories = async () => {
        try {
            const response = await axios.get(URL_CATEGORY)
            setCategories(response.data.map(cat => ({ label: cat.name, value: cat.id })))
        } catch (err) { console.log(err) }
    }
    const handleUpdateBook = async (updatedValues) => {
        try {
            setLoading(true);
            const { id, category, createdAt, updatedAt, ...cleanData } = updatedValues;
            await axios.patch(`${URL_BOOK}/${editItem.id}`, cleanData);
            setEditItem(null);
            await fetchBooks(); 
        } catch (err) { console.log(err) }
        finally { setLoading(false) }
    }

    const handleAddBook = async (newBook) => { 
        try { 
            await axios.post(URL_BOOK, newBook); 
            // 2. สั่งปิด Modal เมื่อบันทึกเสร็จ
            setIsAddModalOpen(false); 
            await fetchBooks(); 
        } catch (err) { console.log(err) } 
    }
    
    const handleLikeBook = async (book) => { try { await axios.post(`${URL_BOOK}/${book.id}/like`); await fetchBooks(); } catch (err) { console.log(err) } }
    const handleDeleteBook = async (bookId) => { try { await axios.delete(`${URL_BOOK}/${bookId}`); await fetchBooks(); } catch (err) { console.log(err) } }

    useEffect(() => { fetchBooks(); fetchCategories(); }, [])

    const filteredBooks = bookData.filter(book => {
        if (filterCategories.length === 0) return true;
        return filterCategories.includes(book.category?.id);
    });

    useEffect(() => {
        const sum = filteredBooks.reduce((total, book) => total + (Number(book.price) * Number(book.stock)), 0);
        setTotalAmount(sum);
    }, [filteredBooks])

    return (
        <div style={{ padding: '10px' }}> 
            <Row gutter={[16, 16]} align="middle" justify="space-between" style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={16} md={12}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Filter by Category:</span>
                        <Select
                            mode="multiple"
                            size="large"
                            tagRender={tagRender}
                            style={{ flex: 1, minWidth: '200px' }}
                            options={categories}
                            placeholder="Select categories..."
                            onChange={(values) => setFilterCategories(values)}
                            allowClear
                        />
                    </div>
                </Col>
                <Col>
                    {/* 3. ตรวจสอบปุ่ม onClick ให้ถูกต้อง */}
                    <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setIsAddModalOpen(true)}>
                        Create New Book
                    </Button>
                </Col>
            </Row>

            <Card style={{ marginBottom: '24px', textAlign: 'center', background: '#f9f9f9' }}>
                <h3 style={{ margin: 0, color: '#555' }}>
                    Total Value: <span style={{ color: '#1890ff', fontSize: '1.2em' }}>${totalAmount.toLocaleString()}</span>
                </h3>
            </Card>

            <Spin spinning={loading}>
                <Card bodyStyle={{ padding: '0' }} bordered={false}>
                    <BookList
                        data={filteredBooks}
                        onLiked={handleLikeBook}
                        onDeleted={handleDeleteBook}
                        onEdit={(record) => setEditItem(record)} 
                    />
                </Card>
            </Spin>

            <EditBook
                isOpen={!!editItem} 
                item={editItem}
                categories={categories}
                onCancel={() => setEditItem(null)}
                onSave={handleUpdateBook}
            />

            {/* 4. Modal สำหรับ AddBook */}
            <Modal
                title="Add New Book"
                open={isAddModalOpen} 
                onCancel={() => setIsAddModalOpen(false)}
                footer={null}
                width={600}
            >
                <AddBook 
                    onBookAdded={handleAddBook} 
                    categories={categories} 
                />
            </Modal>
        </div>
    )
}

export default BookScreen