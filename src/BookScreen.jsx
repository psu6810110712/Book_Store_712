import './App.css'
import { useState, useEffect } from 'react'
import { Divider, Spin, Select, Tag } from 'antd' // 1. Import Select, Tag เพิ่ม
import BookList from './components/BookList'
import AddBook from './components/AddBook'
import EditBook from './components/EditBook'
import axios from 'axios'

axios.defaults.baseURL = "http://localhost:3000"
const URL_BOOK = "/api/book"
const URL_CATEGORY = "/api/book-category"

// 2. ฟังก์ชันเลือกสีตามตัวอักษร (เพื่อให้แต่ละหมวดมีสีประจำตัว)
const getColorByName = (name) => {
    const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

// 3. Custom Tag Render (จากโค้ดที่คุณส่งมา ปรับแต่งนิดหน่อยให้รองรับสี)
const tagRender = (props) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };
    return (
        <Tag
            color={getColorByName(label)} // ใช้ชื่อหมวด (label) เพื่อเลือกสี
            onMouseDown={onPreventMouseDown}
            closable={closable}
            onClose={onClose}
            style={{ marginInlineEnd: 4 }}
        >
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

    // 4. State สำหรับเก็บหมวดหมู่ที่ถูกเลือกเพื่อกรอง
    const [filterCategories, setFilterCategories] = useState([]);

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
            setCategories(response.data.map(cat => ({
                label: cat.name,
                value: cat.id
            })))
        } catch (err) { console.log(err) }
    }

    // ... (ฟังก์ชัน handleUpdateBook, handleAddBook, etc. เหมือนเดิม) ...
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
    const handleAddBook = async (newBook) => { try { await axios.post(URL_BOOK, newBook); await fetchBooks(); } catch (err) { console.log(err) } }
    const handleLikeBook = async (book) => { try { await axios.post(`${URL_BOOK}/${book.id}/like`); await fetchBooks(); } catch (err) { console.log(err) } }
    const handleDeleteBook = async (bookId) => { try { await axios.delete(`${URL_BOOK}/${bookId}`); await fetchBooks(); } catch (err) { console.log(err) } }

    useEffect(() => {
        fetchBooks()
        fetchCategories(); 
    }, [])

    // 5. คำนวณราคารวม (คิดเฉพาะหนังสือที่ผ่านการกรอง)
    // กรองข้อมูลหนังสือ
    const filteredBooks = bookData.filter(book => {
        if (filterCategories.length === 0) return true; // ถ้าไม่เลือกอะไรเลย ให้แสดงทั้งหมด
        return filterCategories.includes(book.category?.id); // แสดงเฉพาะหมวดที่เลือก
    });

    useEffect(() => {
        const sum = filteredBooks.reduce((total, book) => total + (Number(book.price) * Number(book.stock)), 0);
        setTotalAmount(sum);
    }, [filteredBooks]) // เปลี่ยน dependency เป็น filteredBooks

    return (
        <>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1em" }}>
                <AddBook onBookAdded={handleAddBook} categories={categories} />
            </div>

            {/* 6. เพิ่มส่วน Filter Dropdown โดยใช้ Custom Tag Render */}
            <div style={{ marginBottom: '1em', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontWeight: 'bold' }}>Filter by Category:</span>
                <Select
                    mode="multiple"
                    tagRender={tagRender}
                    style={{ width: '100%', maxWidth: '400px' }}
                    options={categories}
                    placeholder="Select categories to filter"
                    onChange={(values) => setFilterCategories(values)}
                    allowClear
                />
            </div>

            <Divider>
                My books worth {totalAmount.toLocaleString()} dollars
            </Divider>

            <Spin spinning={loading}>
                <BookList
                    data={filteredBooks} // ส่งข้อมูลที่กรองแล้วไปแสดง
                    onLiked={handleLikeBook}
                    onDeleted={handleDeleteBook}
                    onEdit={(record) => setEditItem(record)} 
                />
            </Spin>

            <EditBook
                isOpen={!!editItem} 
                item={editItem}
                categories={categories}
                onCancel={() => setEditItem(null)}
                onSave={handleUpdateBook}
            />
        </>
    )
}

export default BookScreen