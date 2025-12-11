import { createContext, useContext, useState, useEffect } from 'react';

// Translation strings
const translations = {
    en: {
        // Navigation
        books: 'Books',
        dashboard: 'Dashboard',
        categories: 'Categories',
        recommendations: 'Recommendations',
        logout: 'Logout',
        logoutConfirm: 'Are you sure you want to logout?',

        // Book List
        searchPlaceholder: 'Search books...',
        addBook: 'Add Book',
        editBook: 'Edit Book',
        deleteBook: 'Delete Book',
        deleteConfirm: 'Are you sure you want to delete this book?',
        actions: 'Actions',

        // Book Form
        title: 'Title',
        author: 'Author',
        price: 'Price',
        stock: 'Stock',
        category: 'Category',
        description: 'Description',
        save: 'Save',
        cancel: 'Cancel',
        submit: 'Submit',

        // AI Features
        aiInsights: 'AI Book Insights',
        aiAnalyzing: 'AI is analyzing...',
        regenerate: 'Regenerate',
        close: 'Close',
        summary: 'Summary',
        keyPoints: 'Key Points',
        recommendFor: 'Recommended For',
        genre: 'Genre',

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
        totalValue: 'Total Value',
        totalStock: 'Total Stock',
        totalLikes: 'Total Likes',

        // Categories
        categoryManagement: 'Category Management',
        addCategory: 'Add Category',
        categoryName: 'Category Name',

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
    },
    th: {
        // Navigation
        books: 'หนังสือ',
        dashboard: 'แดชบอร์ด',
        categories: 'หมวดหมู่',
        recommendations: 'แนะนำหนังสือ',
        logout: 'ออกจากระบบ',
        logoutConfirm: 'คุณต้องการออกจากระบบหรือไม่?',

        // Book List
        searchPlaceholder: 'ค้นหาหนังสือ...',
        addBook: 'เพิ่มหนังสือ',
        editBook: 'แก้ไขหนังสือ',
        deleteBook: 'ลบหนังสือ',
        deleteConfirm: 'คุณต้องการลบหนังสือนี้หรือไม่?',
        actions: 'จัดการ',

        // Book Form
        title: 'ชื่อหนังสือ',
        author: 'ผู้แต่ง',
        price: 'ราคา',
        stock: 'จำนวน',
        category: 'หมวดหมู่',
        description: 'รายละเอียด',
        save: 'บันทึก',
        cancel: 'ยกเลิก',
        submit: 'ส่ง',

        // AI Features
        aiInsights: 'AI วิเคราะห์หนังสือ',
        aiAnalyzing: 'AI กำลังวิเคราะห์...',
        regenerate: 'วิเคราะห์ใหม่',
        close: 'ปิด',
        summary: 'สรุป',
        keyPoints: 'จุดเด่น',
        recommendFor: 'แนะนำให้',
        genre: 'ประเภท',

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
        totalValue: 'มูลค่ารวม',
        totalStock: 'สต็อกรวม',
        totalLikes: 'ยอดไลค์รวม',

        // Categories
        categoryManagement: 'จัดการหมวดหมู่',
        addCategory: 'เพิ่มหมวดหมู่',
        categoryName: 'ชื่อหมวดหมู่',

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
