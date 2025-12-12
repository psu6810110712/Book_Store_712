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

        // Login
        loginTitle: 'Book Store Login',
        username: 'Username',
        password: 'Password',
        rememberMe: 'Remember me',
        loginButton: 'Log in',
        enterUsername: 'Please enter your username!',
        enterPassword: 'Please enter your password!',
        welcomeBack: 'Welcome back!',

        // Book List & Table
        filter: 'Filter',
        selectCategories: 'Select categories...',
        searchPlaceholder: 'Search...',
        searchByTitle: 'Title',
        searchByAuthor: 'Author',
        searchByISBN: 'ISBN',
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
        aiTitle: 'AI-Powered Book Recommendations',
        aiDescription: 'Tell us what you like, and let our AI recommend the perfect books for you! 📚',
        analyzingPreferences: 'AI is analyzing your preferences...',
        suggestionHint: '💡 Want different suggestions? Adjust your preferences and try again!',
        moodAdventurous: 'Adventurous 🗺️',
        moodThoughtful: 'Thoughtful 🤔',
        moodEscapist: 'Need an Escape 🌟',
        moodMotivated: 'Looking for Motivation 💪',
        moodRelaxed: 'Want to Relax 😌',
        moodCurious: 'Curious to Learn 📖',
        moodEmotional: 'In the Mood for Feelings ❤️',

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
        exportPDF: 'Export PDF',
        allCategories: 'All Categories',
        dashboardTitle: 'Dashboard & Reports',
        rank: 'Rank',
        value: 'Value',
        stockLevels: 'Stock Levels by Book',
        numBooks: 'Number of Books',
        stockQty: 'Stock Quantity',
        topBestSellers: 'Top 10 Best Sellers (by Likes)',

        // Categories
        categoryManagement: 'Category Management',
        addCategory: 'Add Category',
        categoryName: 'Category Name',
        createdAt: 'Created At',
        actions: 'Actions',
        deleteCategory: 'Delete category?',
        categoryInUse: 'This will affect books in this category.',
        editCategoryTitle: 'Edit Category',
        addCategoryTitle: 'Add New Category',
        update: 'Update',
        create: 'Create',
        tooManyRequests: '⏳ Too many requests. Please wait.',
        modelNotAvailable: '❌ Model not available',
        clickToRegenerate: 'Click "Regenerate" to get insights',
        anyoneWhoLovesReading: 'Anyone who loves reading',
        generalGenre: 'General',

        // Stock Alerts
        lowInventory: 'Low Inventory',
        allHealthy: 'All stock levels are healthy!',
        outOfStock: 'OUT OF STOCK',
        critical: 'CRITICAL',
        // Stock Alerts
        lowInventory: 'Low Inventory',
        allHealthy: 'All stock levels are healthy!',
        outOfStock: 'OUT OF STOCK',
        critical: 'CRITICAL',
        low: 'LOW',
        refresh: 'Refresh',
        restock: 'Restock',
        confirmRestock: 'Confirm Restock',
        currentStock: 'Current Stock',
        addQuantity: 'Add Quantity',
        newStock: 'New Stock',
        immediateAction: 'Immediate action required!',
        considerRestocking: 'Consider restocking soon.',
        warning: 'Warning',
        criticalAlert: 'Critical',
        restockSuccess: 'units restocked successfully!',
        enterValidQuantity: 'Please enter a valid quantity',

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

        // Login
        loginTitle: 'เข้าสู่ระบบร้านหนังสือ',
        username: 'ชื่อผู้ใช้',
        password: 'รหัสผ่าน',
        rememberMe: 'จดจำฉัน',
        loginButton: 'เข้าสู่ระบบ',
        enterUsername: 'กรุณากรอกชื่อผู้ใช้!',
        enterPassword: 'กรุณากรอกรหัสผ่าน!',
        welcomeBack: 'ยินดีต้อนรับกลับมา!',

        // Book List & Table
        filter: 'ตัวกรอง',
        selectCategories: 'เลือกหมวดหมู่...',
        searchPlaceholder: 'ค้นหา...',
        searchByTitle: 'ชื่อหนังสือ',
        searchByAuthor: 'ผู้แต่ง',
        searchByISBN: 'ISBN',
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
        aiTitle: 'แนะนำหนังสือด้วย AI',
        aiDescription: 'บอกเราว่าคุณชอบอะไร แล้วให้ AI แนะนำหนังสือที่เหมาะกับคุณ! 📚',
        analyzingPreferences: 'AI กำลังวิเคราะห์ความชอบของคุณ...',
        suggestionHint: '💡 อยากได้คำแนะนำอื่น? ปรับเปลี่ยนความชอบแล้วลองใหม่!',
        moodAdventurous: 'ผจญภัย 🗺️',
        moodThoughtful: 'ช่างคิด 🤔',
        moodEscapist: 'ต้องการหลีกหนีความจริง 🌟',
        moodMotivated: 'หาแรงบันดาลใจ 💪',
        moodRelaxed: 'ผ่อนคลาย 😌',
        moodCurious: 'อยากรู้อยากเห็น 📖',
        moodEmotional: 'อารมณ์อ่อนไหว ❤️',

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
        exportPDF: 'ส่งออก PDF',
        allCategories: 'ทุกหมวดหมู่',
        dashboardTitle: 'แดชบอร์ดและรายงาน',
        rank: 'อันดับ',
        value: 'มูลค่า',
        stockLevels: 'ระดับสต็อกตามหนังสือ',
        numBooks: 'จำนวนหนังสือ',
        stockQty: 'จำนวนสต็อก',
        topBestSellers: '10 อันดับหนังสือขายดี (ตามยอดไลค์)',

        // Categories
        categoryManagement: 'จัดการหมวดหมู่',
        addCategory: 'เพิ่มหมวดหมู่',
        categoryName: 'ชื่อหมวดหมู่',
        createdAt: 'วันที่สร้าง',
        actions: 'จัดการ',
        deleteCategory: 'ลบหมวดหมู่?',
        categoryInUse: 'จะส่งผลต่อหนังสือในหมวดหมู่นี้',
        editCategoryTitle: 'แก้ไขหมวดหมู่',
        addCategoryTitle: 'เพิ่มหมวดหมู่ใหม่',
        update: 'อัปเดต',
        create: 'สร้าง',
        tooManyRequests: '⏳ คำขอมากเกินไป กรุณารอสักครู่',
        modelNotAvailable: '❌ Model ไม่พร้อมใช้งาน',
        clickToRegenerate: 'คลิก "วิเคราะห์ใหม่" เพื่อดูข้อมูล',
        anyoneWhoLovesReading: 'ทุกคนที่รักการอ่าน',
        generalGenre: 'ทั่วไป',

        // Stock Alerts
        lowInventory: 'สินค้าคงคลังต่ำ',
        allHealthy: 'สต็อกทุกรายการอยู่ในระดับปกติ!',
        outOfStock: 'หมด',
        critical: 'วิกฤต',
        // Stock Alerts
        lowInventory: 'สินค้าคงคลังต่ำ',
        allHealthy: 'สต็อกทุกรายการอยู่ในระดับปกติ!',
        outOfStock: 'หมด',
        critical: 'วิกฤต',
        low: 'ต่ำ',
        refresh: 'รีเฟรช',
        restock: 'เติมสต็อก',
        confirmRestock: 'ยืนยันการเติม',
        currentStock: 'สต็อกปัจจุบัน',
        addQuantity: 'จำนวนที่เพิ่ม',
        newStock: 'สต็อกใหม่',
        immediateAction: 'ต้องดำเนินการทันที!',
        considerRestocking: 'ควรพิจารณาเติมสต็อกเร็วๆ นี้',
        warning: 'คำเตือน',
        criticalAlert: 'วิกฤต',
        restockSuccess: 'หน่วย ถูกเติมเรียบร้อยแล้ว!',
        enterValidQuantity: 'กรุณาระบุจำนวนที่ถูกต้อง',

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
