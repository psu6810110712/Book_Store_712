const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    /* ========== SHEET 1: DASHBOARD SUMMARY ========== */
    const now = new Date();
    const avgPrice = books.length > 0 ? (books.reduce((sum, b) => sum + b.price, 0) / books.length) : 0;
    const avgStock = books.length > 0 ? (books.reduce((sum, b) => sum + b.stock, 0) / books.length) : 0;
    const totalLikes = books.reduce((sum, b) => sum + (b.likes || b.likeCount || b.like_count || 0), 0);

    const summaryData = [
        ['📊 BOOK STORE DASHBOARD REPORT'],
        ['Generated:', now.toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })],
        [],
        ['═══════════════════════════════════════'],
        ['📈 KEY METRICS', ''],
        ['═══════════════════════════════════════'],
        ['Total Books in Catalog', statistics.totalBooks],
        ['Total Inventory Value', `$${statistics.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`],
        ['Total Stock Units', statistics.totalStock.toLocaleString()],
        ['Total Likes/Favorites', totalLikes.toLocaleString()],
        ['Average Price per Book', `$${avgPrice.toFixed(2)}`],
        ['Average Stock per Book', avgStock.toFixed(1)],
        [],
        ['⚠️ STOCK STATUS', ''],
        ['═══════════════════════════════════════'],
        ['Low Stock Items (< 10 units)', statistics.lowStockItems],
        ['Critical Stock (< 5 units)', books.filter(b => b.stock < 5).length],
        ['Out of Stock (0 units)', books.filter(b => b.stock === 0).length],
        ['Healthy Stock (≥ 10 units)', books.filter(b => b.stock >= 10).length],
        [],
        ['💰 VALUE ANALYSIS', ''],
        ['═══════════════════════════════════════'],
        ['Highest Priced Book', books.length > 0 ? `$${Math.max(...books.map(b => b.price)).toFixed(2)}` : 'N/A'],
        ['Lowest Priced Book', books.length > 0 ? `$${Math.min(...books.map(b => b.price)).toFixed(2)}` : 'N/A'],
        ['Most Stocked Book', books.length > 0 ? Math.max(...books.map(b => b.stock)) : 'N/A'],
    ];

    const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
    ws1['!cols'] = [{ wch: 30 }, { wch: 25 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Summary');

    /* ========== SHEET 2: ALL BOOKS INVENTORY ========== */
    const allBooksData = books.map((book, index) => ({
        '#': index + 1,
        'ISBN': book.isbn || 'N/A',
        'Title': book.title,
        'Author': book.author,
        'Category': book.book_category_name || 'Uncategorized',
        'Description': (book.description || '').substring(0, 100) + '...',
        'Price ($)': parseFloat(book.price).toFixed(2),
        'Stock Qty': book.stock,
        'Stock Value ($)': (book.price * book.stock).toFixed(2),
        'Likes': book.likes || book.likeCount || book.like_count || 0,
        'Stock Status': book.stock === 0 ? 'OUT OF STOCK' :
            book.stock < 5 ? 'CRITICAL' :
                book.stock < 10 ? 'LOW' : 'OK',
    }));

    const ws2 = XLSX.utils.json_to_sheet(allBooksData);
    ws2['!cols'] = [
        { wch: 5 },  // #
        { wch: 15 }, // ISBN
        { wch: 35 }, // Title
        { wch: 20 }, // Author
        { wch: 15 }, // Category
        { wch: 50 }, // Description
        { wch: 10 }, // Price
        { wch: 10 }, // Stock Qty
        { wch: 15 }, // Stock Value
        { wch: 8 },  // Likes
        { wch: 15 }, // Status
    ];
    XLSX.utils.book_append_sheet(wb, ws2, 'All Books');

    /* ========== SHEET 3: TOP 10 BEST SELLERS ========== */
    const bestSellersData = bestSellers.map((book, index) => ({
        '🏆 Rank': index + 1,
        'Title': book.title,
        'Author': book.author,
        'Category': book.book_category_name || 'N/A',
        'ISBN': book.isbn || 'N/A',
        'Likes ❤️': book.likes || book.likeCount || book.like_count || 0,
        'Price ($)': parseFloat(book.price).toFixed(2),
        'Stock': book.stock,
        'Total Value ($)': (book.price * book.stock).toFixed(2),
        'Popularity Score': ((book.likes || 0) * 10 + book.stock).toFixed(0),
    }));

    const ws3 = XLSX.utils.json_to_sheet(bestSellersData);
    ws3['!cols'] = [
        { wch: 8 },  // Rank
        { wch: 35 }, // Title
        { wch: 20 }, // Author
        { wch: 15 }, // Category
        { wch: 15 }, // ISBN
        { wch: 10 }, // Likes
        { wch: 10 }, // Price
        { wch: 10 }, // Stock
        { wch: 15 }, // Total Value
        { wch: 15 }, // Popularity
    ];
    XLSX.utils.book_append_sheet(wb, ws3, 'Best Sellers');

    /* ========== SHEET 4: LOW STOCK ALERTS ========== */
    const lowStockBooks = books.filter(b => b.stock < 10);
    const lowStockData = lowStockBooks.map((book, index) => ({
        '#': index + 1,
        'Alert Level': book.stock === 0 ? '🔴 OUT OF STOCK' :
            book.stock < 5 ? '🟠 CRITICAL' : '🟡 LOW',
        'Title': book.title,
        'Author': book.author,
        'Category': book.book_category_name || 'N/A',
        'Current Stock': book.stock,
        'Recommended Reorder': Math.max(20, book.stock * 3),
        'Price ($)': parseFloat(book.price).toFixed(2),
        'Restock Cost ($)': (parseFloat(book.price) * Math.max(20, book.stock * 3)).toFixed(2),
    }));

    const ws4 = XLSX.utils.json_to_sheet(lowStockData);
    ws4['!cols'] = [
        { wch: 5 },  // #
        { wch: 18 }, // Alert Level
        { wch: 35 }, // Title
        { wch: 20 }, // Author
        { wch: 15 }, // Category
        { wch: 12 }, // Current Stock
        { wch: 18 }, // Recommended
        { wch: 10 }, // Price
        { wch: 15 }, // Restock Cost
    ];
    XLSX.utils.book_append_sheet(wb, ws4, 'Low Stock Alerts');

    /* ========== SHEET 5: CATEGORY ANALYSIS ========== */
    const categoryStats = {};
    books.forEach(book => {
        const cat = book.book_category_name || 'Uncategorized';
        if (!categoryStats[cat]) {
            categoryStats[cat] = {
                count: 0,
                totalValue: 0,
                totalStock: 0,
                totalLikes: 0,
            };
        }
        categoryStats[cat].count++;
        categoryStats[cat].totalValue += book.price * book.stock;
        categoryStats[cat].totalStock += book.stock;
        categoryStats[cat].totalLikes += book.likes || book.likeCount || book.like_count || 0;
    });

    const categoryData = Object.entries(categoryStats).map(([category, stats]) => ({
        'Category': category,
        'Total Books': stats.count,
        'Total Stock Units': stats.totalStock,
        'Avg Stock per Book': (stats.totalStock / stats.count).toFixed(1),
        'Total Value ($)': stats.totalValue.toFixed(2),
        'Avg Value per Book ($)': (stats.totalValue / stats.count).toFixed(2),
        'Total Likes': stats.totalLikes,
        'Popularity Index': ((stats.totalLikes / stats.count) * 100).toFixed(0),
    }));

    const ws5 = XLSX.utils.json_to_sheet(categoryData);
    ws5['!cols'] = [
        { wch: 18 }, // Category
        { wch: 12 }, // Total Books
        { wch: 15 }, // Total Stock
        { wch: 18 }, // Avg Stock
        { wch: 15 }, // Total Value
        { wch: 20 }, // Avg Value
        { wch: 12 }, // Total Likes
        { wch: 15 }, // Popularity
    ];
    XLSX.utils.book_append_sheet(wb, ws5, 'Category Analysis');

    // Generate filename with date and time
    const fileName = `BookStore_Detailed_Report_${now.toISOString().slice(0, 19).replace(/:/g, '-')}.xlsx`;

    // Save file
    XLSX.writeFile(wb, fileName);
};
