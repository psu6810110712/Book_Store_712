import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
    en: {
        // Navigation
        books: 'Books',
        addBook: 'Add Book',
        stockAlerts: 'Stock Alerts',
        dashboard: 'Dashboard',
        categories: 'Categories',
        recommendations: 'Recommendations',
        logout: 'Logout',
        logoutConfirm: 'Are you sure you want to logout?',

        // Book List & Table
        filter: 'Filter',
        selectCategories: 'Select categories...',
        searchPlaceholder: 'Search terms...',
        createNewBook: 'Create New Book',
        totalValue: 'Total Value',

        // Table Headers
        title: 'Title',
        author: 'Author',
        description: 'Description',
        price: 'Price',
        isbn: 'ISBN',
        stock: 'Stock',
        cover: 'Cover',
        category: 'Category',
        liked: 'Liked',
        action: 'Action',

        // Table Actions
        like: 'Like',
        edit: 'Edit',
        delete: 'Delete',
        deleteConfirm: 'Are you sure?',

        // Add/Edit Book
        editBook: 'Edit Book',
        save: 'Save',
        cancel: 'Cancel',
        submit: 'Submit',
        saveAndAddAnother: 'Save & Add Another',
        deployAll: 'Deploy All',
        backToBooks: 'Back to Books',
        addNewBook: 'Add New Book',
        booksAddedSession: 'book(s) added in this session',
        deployBooks: 'Deploy',

        // AI Features
        aiInsights: 'AI Book Insights',
        aiAnalyzing: 'AI is analyzing...',
        regenerate: 'Regenerate',
        close: 'Close',
        summary: 'Summary',
        keyPoints: 'Key Points',
        recommendFor: 'Recommended For',
        genre: 'Genre',
        askAI: 'AI',

        // Recommendations
        getRecommendations: 'Get AI Recommendations',
        preferences: 'What kind of books do you enjoy?',
        previousBooks: 'Books you\'ve loved recently',
        favoriteGenres: 'Favorite Genres',
        currentMood: 'Current Reading Mood',
        yourRecommendations: 'Your Personalized Recommendations',
        topPick: 'Top Pick!',
        whyLoveIt: 'Why you\'ll love it',
        about: 'About',

        // Dashboard
        totalBooks: 'Total Books',
        inventoryValue: 'Inventory Value',
        totalStock: 'Total Stock',
        totalLikes: 'Total Likes',
        lowStockItems: 'Low Stock Items',
        bestSellers: 'Best Sellers',
        booksByCategory: 'Books by Category',
        stockByBook: 'Stock by Book',
        exportPDF: 'Export PDF',
        allCategories: 'All Categories',

        // Categories
        categoryManagement: 'Category Management',
        addCategory: 'Add Category',
        categoryName: 'Category Name',
        createdAt: 'Created At',
        actions: 'Actions',
        deleteCategory: 'Delete category?',
        categoryInUse: 'This will affect books in this category.',

        // Stock Alerts
        lowInventory: 'Low Inventory',
        allHealthy: 'All stock levels are healthy!',
        outOfStock: 'OUT OF STOCK',
        critical: 'CRITICAL',
        low: 'LOW',

        // Settings
        settings: 'Settings',
        language: 'Language',
        theme: 'Theme',
        darkMode: 'Dark Mode',

        // Common
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        noData: 'No data available',
        yes: 'Yes',
        no: 'No',
        total: 'Total',
        items: 'items',
    },
    th: {
        // Navigation
        books: 'หนังสือ',
        addBook: 'เพิ่มหนังสือ',
        stockAlerts: 'แจ้งเตือนสต็อก',
        dashboard: 'แดชบอร์ด',
        categories: 'หมวดหมู่',
        recommendations: 'แนะนำหนังสือ',
        logout: 'ออกจากระบบ',
        logoutConfirm: 'คุณต้องการออกจากระบบหรือไม่?',

        // Book List & Table
        filter: 'กรอง',
        selectCategories: 'เลือกหมวดหมู่...',
        searchPlaceholder: 'ค้นหา...',
        createNewBook: 'สร้างหนังสือใหม่',
        totalValue: 'มูลค่ารวม',

        // Table Headers
        title: 'ชื่อหนังสือ',
        author: 'ผู้แต่ง',
        description: 'รายละเอียด',
        price: 'ราคา',
        isbn: 'ISBN',
        stock: 'สต็อก',
        cover: 'ปก',
        category: 'หมวดหมู่',
        liked: 'ถูกใจ',
        action: 'จัดการ',

        // Table Actions
        like: 'ถูกใจ',
        edit: 'แก้ไข',
        delete: 'ลบ',
        deleteConfirm: 'คุณแน่ใจหรือไม่?',

        // Add/Edit Book
        editBook: 'แก้ไขหนังสือ',
        save: 'บันทึก',
        cancel: 'ยกเลิก',
        submit: 'ส่ง',
        saveAndAddAnother: 'บันทึก & เพิ่มต่อ',
        deployAll: 'เสร็จสิ้น',
        backToBooks: 'กลับไปหน้าหนังสือ',
        addNewBook: 'เพิ่มหนังสือใหม่',
        booksAddedSession: 'เล่มที่เพิ่มในเซสชันนี้',
        deployBooks: 'เสร็จสิ้น',

        // AI Features
        aiInsights: 'AI วิเคราะห์หนังสือ',
        aiAnalyzing: 'AI กำลังวิเคราะห์...',
        regenerate: 'วิเคราะห์ใหม่',
        close: 'ปิด',
        summary: 'สรุป',
        keyPoints: 'จุดเด่น',
        recommendFor: 'แนะนำให้',
        genre: 'ประเภท',
        askAI: 'AI',

        // Recommendations
        getRecommendations: 'รับคำแนะนำจาก AI',
        preferences: 'คุณชอบหนังสือแบบไหน?',
        previousBooks: 'หนังสือที่คุณชอบ',
        favoriteGenres: 'ประเภทที่ชอบ',
        currentMood: 'อารมณ์การอ่านตอนนี้',
        yourRecommendations: 'หนังสือแนะนำสำหรับคุณ',
        topPick: 'แนะนำอันดับ 1!',
        whyLoveIt: 'ทำไมคุณจะชอบ',
        about: 'เกี่ยวกับ',

        // Dashboard
        totalBooks: 'จำนวนหนังสือ',
        inventoryValue: 'มูลค่าสินค้าคงคลัง',
        totalStock: 'สต็อกรวม',
        totalLikes: 'ยอดถูกใจรวม',
        lowStockItems: 'สินค้าสต็อกต่ำ',
        bestSellers: 'หนังสือขายดี',
        booksByCategory: 'หนังสือตามหมวดหมู่',
        stockByBook: 'สต็อกตามหนังสือ',
        exportPDF: 'ส่งออก PDF',
        allCategories: 'ทุกหมวดหมู่',

        // Categories
        categoryManagement: 'จัดการหมวดหมู่',
        addCategory: 'เพิ่มหมวดหมู่',
        categoryName: 'ชื่อหมวดหมู่',
        createdAt: 'วันที่สร้าง',
        actions: 'จัดการ',
        deleteCategory: 'ลบหมวดหมู่?',
        categoryInUse: 'จะส่งผลต่อหนังสือในหมวดหมู่นี้',

        // Stock Alerts
        lowInventory: 'สินค้าคงคลังต่ำ',
        allHealthy: 'สต็อกทุกรายการอยู่ในระดับปกติ!',
        outOfStock: 'หมด',
        critical: 'วิกฤต',
        low: 'ต่ำ',

        // Settings
        settings: 'ตั้งค่า',
        language: 'ภาษา',
        theme: 'ธีม',
        darkMode: 'โหมดมืด',

        // Common
        loading: 'กำลังโหลด...',
        error: 'เกิดข้อผิดพลาด',
        success: 'สำเร็จ',
        noData: 'ไม่มีข้อมูล',
        yes: 'ใช่',
        no: 'ไม่',
        total: 'รวม',
        items: 'รายการ',
    }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('app-language') || 'en';
    });

    useEffect(() => {
        localStorage.setItem('app-language', language);
    }, [language]);

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'th' : 'en');
    };

    const t = (key) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
}

export default LanguageContext;
