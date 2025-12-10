import './App.css'
import { useState, useEffect } from 'react'
import { Divider, Spin, Select, Tag, Button, Modal, Card, Row, Col, Input } from 'antd' // 1. Import Input
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import BookList from './components/BookList'
import AddBook from './components/AddBook'
import EditBook from './components/EditBook'
import GeminiBookDetails from './components/GeminiBookDetails'
import axios from 'axios'

axios.defaults.baseURL = "http://localhost:3000"
const URL_BOOK = "/api/book"
const URL_CATEGORY = "/api/book-category"
const { Option } = Select; // ดึง Option ออกมาใช้กับ Dropdown

// ... (Helper functions: getColorByName, tagRender เหมือนเดิม) ...
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
    const navigate = useNavigate();
    const [totalAmount, setTotalAmount] = useState(0);
    const [bookData, setBookData] = useState([])
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [editItem, setEditItem] = useState(null);
    const [filterCategories, setFilterCategories] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Gemini AI state
    const [selectedBookForAI, setSelectedBookForAI] = useState(null);
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);

    // 2. เพิ่ม State สำหรับการค้นหา
    const [searchText, setSearchText] = useState("");
    const [searchType, setSearchType] = useState("title"); // ค่าเริ่มต้นค้นหาด้วย Title

    // ... (Functions fetchBooks, fetchCategories, handle... เหมือนเดิม) ...
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
            // ลบ fields ที่ Backend ไม่รับออก
            const { id, category, createdAt, updatedAt, ...cleanData } = updatedValues;
            // ใช้ id จาก updatedValues แทน editItem.id
            await axios.patch(`${URL_BOOK}/${id}`, cleanData);
            setEditItem(null);
            await fetchBooks();
        } catch (err) { console.log(err) }
        finally { setLoading(false) }
    }
    const handleAddBook = async (newBook) => { try { await axios.post(URL_BOOK, newBook); setIsAddModalOpen(false); await fetchBooks(); } catch (err) { console.log(err) } }
    const handleLikeBook = async (book) => { try { await axios.post(`${URL_BOOK}/${book.id}/like`); await fetchBooks(); } catch (err) { console.log(err) } }
    const handleDeleteBook = async (bookId) => { try { await axios.delete(`${URL_BOOK}/${bookId}`); await fetchBooks(); } catch (err) { console.log(err) } }

    // Handler for AI insights
    const handleAskAI = (book) => {
        setSelectedBookForAI(book);
        setIsAIModalOpen(true);
    }


    useEffect(() => { fetchBooks(); fetchCategories(); }, [])

    // 3. ปรับปรุง Logic การกรอง (รวม Category + Search)
    const filteredBooks = bookData.filter(book => {
        // กรอง 1: Category
        const matchCategory = filterCategories.length === 0 ||
            (book.category && filterCategories.includes(book.category.id)); // เช็ค book.category ก่อน

        // กรอง 2: Search Text
        if (!searchText) return matchCategory;

        // เช็คว่ามีค่าใน field นั้นไหมก่อนเรียก toString()
        const rawValue = book[searchType];
        const valueToSearch = rawValue ? rawValue.toString().toLowerCase() : "";
        const keyword = searchText.toLowerCase();

        return matchCategory && valueToSearch.includes(keyword);
    });
    useEffect(() => {
        const sum = filteredBooks.reduce((total, book) => total + (Number(book.price) * Number(book.stock)), 0);
        setTotalAmount(sum);
    }, [filteredBooks])

    // 4. สร้างส่วน Dropdown เลือกประเภท (สำหรับใส่หน้าช่อง Search)
    const selectBefore = (
        <Select defaultValue="title" onSelect={(value) => setSearchType(value)} style={{ width: 100 }} variant="borderless">
            <Option value="title">Title</Option>
            <Option value="author">Author</Option>
            <Option value="isbn">ISBN</Option>
        </Select>
    );

    return (
        <div style={{ padding: '12px' }}>

            {/* Header Controls */}
            <div style={{ marginBottom: '24px' }}>
                <Row gutter={[16, 16]} align="middle" justify="space-between">

                    {/* ส่วนซ้าย: Filter Category */}
                    <Col xs={24} md={8}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 'bold' }}>Filter:</span>
                            <Select
                                mode="multiple"
                                tagRender={tagRender}
                                style={{ width: '100%' }}
                                options={categories}
                                placeholder="Select categories..."
                                onChange={(values) => setFilterCategories(values)}
                                allowClear
                            />
                        </div>
                    </Col>

                    {/* ส่วนกลาง: Search Bar (ตามแบบในรูป) */}
                    <Col xs={24} md={10}>
                        <Input.Search
                            addonBefore={selectBefore} // ใส่ Dropdown ไว้ด้านหน้า
                            placeholder="Search terms..."
                            allowClear
                            enterButton
                            size="large"
                            onSearch={(value) => setSearchText(value)} // ค้นหาเมื่อกด Enter หรือปุ่มแว่นขยาย
                            onChange={(e) => setSearchText(e.target.value)} // หรือค้นหาทันทีที่พิมพ์ (Real-time)
                        />
                    </Col>

                    {/* ส่วนขวา: ปุ่ม Add New Book */}
                    <Col xs={24} md={6} style={{ textAlign: 'right' }}>
                        <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => navigate('/books/add')}>
                            Create New Book
                        </Button>
                    </Col>
                </Row>
            </div>

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
                        onAskAI={handleAskAI}
                    />
                </Card>
            </Spin>

            {/* Gemini AI Modal */}
            <GeminiBookDetails
                book={selectedBookForAI}
                isOpen={isAIModalOpen}
                onClose={() => {
                    setIsAIModalOpen(false);
                    setSelectedBookForAI(null);
                }}
            />
        </div>
    )
}

export default BookScreen