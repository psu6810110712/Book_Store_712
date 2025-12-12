import './App.css'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { Divider, Spin, Select, Tag, Button, Modal, Card, Row, Col, Input } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import BookList from './components/BookList'
import AddBook from './components/AddBook'
import EditBook from './components/EditBook'
import GeminiBookDetails from './components/GeminiBookDetails'
import { useLanguage } from './contexts/LanguageContext'
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
    const { t } = useLanguage();
    const [bookData, setBookData] = useState([])
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    // editItem: null = modal closed, object = modal open with this item
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

    // Memoized handlers to prevent unnecessary re-renders
    const handleAddBook = useCallback(async (newBook) => {
        try { await axios.post(URL_BOOK, newBook); setIsAddModalOpen(false); await fetchBooks(); }
        catch (err) { console.error(err) }
    }, []);

    const handleLikeBook = useCallback(async (book) => {
        try { await axios.post(`${URL_BOOK}/${book.id}/like`); await fetchBooks(); }
        catch (err) { console.error(err) }
    }, []);

    const handleDeleteBook = useCallback(async (bookId) => {
        try { await axios.delete(`${URL_BOOK}/${bookId}`); await fetchBooks(); }
        catch (err) { console.error(err) }
    }, []);

    // Handler for AI insights
    const handleAskAI = useCallback((book) => {
        setSelectedBookForAI(book);
        setIsAIModalOpen(true);
    }, []);

    // Handler for Edit - open modal with book data (editItem as flag)
    const handleEditBook = useCallback((book) => {
        setEditItem(book); // Set item to open modal
    }, []);

    // Handler for Save Edit - send to server using PATCH
    // Remove fields that backend doesn't accept: id, category, createdAt, updatedAt
    const updateBook = useCallback(async (formData) => {
        try {
            const bookId = editItem.id;

            // Remove fields that backend doesn't accept
            const { id, category, createdAt, updatedAt, ...dataToSend } = formData;

            await axios.patch(`${URL_BOOK}/${bookId}`, dataToSend);
            setEditItem(null); // Close modal
            await fetchBooks();
        } catch (err) {
            console.error(err);
        }
    }, [editItem]);


    useEffect(() => { fetchBooks(); fetchCategories(); }, [])

    // Memoized filtered books to prevent recalculation on every render
    const filteredBooks = useMemo(() => {
        return bookData.filter(book => {
            // Filter 1: Category
            const matchCategory = filterCategories.length === 0 ||
                (book.category && filterCategories.includes(book.category.id));

            // Filter 2: Search Text
            if (!searchText) return matchCategory;

            const rawValue = book[searchType];
            const valueToSearch = rawValue ? rawValue.toString().toLowerCase() : "";
            const keyword = searchText.toLowerCase();

            return matchCategory && valueToSearch.includes(keyword);
        });
    }, [bookData, filterCategories, searchText, searchType]);

    // Memoized total amount calculation
    const totalAmount = useMemo(() => {
        return filteredBooks.reduce((total, book) => total + (Number(book.price) * Number(book.stock)), 0);
    }, [filteredBooks]);

    // Search type dropdown with translations
    const selectBefore = (
        <Select defaultValue="title" onSelect={(value) => setSearchType(value)} style={{ width: 120 }} variant="borderless">
            <Option value="title">{t('searchByTitle')}</Option>
            <Option value="author">{t('searchByAuthor')}</Option>
            <Option value="isbn">{t('searchByISBN')}</Option>
        </Select>
    );

    return (
        <div style={{ padding: '12px' }}>

            {/* Header Controls */}
            <div style={{ marginBottom: '24px' }}>
                <Row gutter={[16, 16]} align="middle">


                    {/* Filter Category - equal width with Search */}
                    <Col xs={24} md={9}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>{t('filter')}:</span>
                            <Select
                                mode="multiple"
                                size="large"
                                tagRender={tagRender}
                                style={{ width: '100%' }}
                                options={categories}
                                placeholder={t('selectCategories')}
                                onChange={(values) => setFilterCategories(values)}
                                allowClear
                            />
                        </div>
                    </Col>


                    {/* Search Bar - equal width with Filter */}
                    <Col xs={24} md={9}>
                        <Input.Search
                            addonBefore={selectBefore}
                            placeholder={t('searchPlaceholder')}
                            allowClear
                            enterButton
                            size="large"
                            onSearch={(value) => setSearchText(value)}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </Col>

                    {/* Add New Book Button */}
                    <Col xs={24} md={6} style={{ textAlign: 'right' }}>
                        <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => navigate('/books/add')}>
                            {t('createNewBook')}
                        </Button>
                    </Col>
                </Row>
            </div>

            <Card
                className="no-select"
                style={{
                    marginBottom: '24px',
                    textAlign: 'center',
                    background: 'transparent',
                    border: '1px dashed #1890ff'
                }}
                bodyStyle={{ padding: '16px' }}
            >
                <h3 className="no-select" style={{ margin: 0, opacity: 0.8 }}>
                    💰 {t('totalValue')}: <span style={{ color: '#1890ff', fontSize: '1.3em', fontWeight: 'bold' }}>${totalAmount.toLocaleString()}</span>
                </h3>
            </Card>

            <Spin spinning={loading}>
                <Card bodyStyle={{ padding: '0' }} bordered={false}>
                    <BookList
                        data={filteredBooks}
                        onLiked={handleLikeBook}
                        onDeleted={handleDeleteBook}
                        onAskAI={handleAskAI}
                        onEdit={handleEditBook}
                    />
                </Card>
            </Spin>

            {/* Edit Book Modal - isOpen is controlled by editItem (null = closed, object = open) */}
            <EditBook
                isOpen={!!editItem}
                item={editItem}
                categories={categories}
                onSave={updateBook}
                onCancel={() => setEditItem(null)}
            />

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