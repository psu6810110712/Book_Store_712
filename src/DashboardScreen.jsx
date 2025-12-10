// src/DashboardScreen.jsx
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Spin } from 'antd';
import { BookOutlined, DollarOutlined, AppstoreOutlined, HeartOutlined } from '@ant-design/icons';
import axios from 'axios';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardScreen() {
  const [chartData, setChartData] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [priceData, setPriceData] = useState(null);
  const [statistics, setStatistics] = useState({
    totalBooks: 0,
    totalValue: 0,
    totalStock: 0,
    totalLikes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // ดึงข้อมูลหนังสือจาก Server
        const response = await axios.get('/api/book');
        const books = response.data;

        // คำนวณสถิติ
        const totalBooks = books.length;
        const totalValue = books.reduce((sum, book) => sum + (book.price * book.stock), 0);
        const totalStock = books.reduce((sum, book) => sum + book.stock, 0);
        const totalLikes = books.reduce((sum, book) => sum + (book.likeCount || 0), 0);

        setStatistics({ totalBooks, totalValue, totalStock, totalLikes });

        // กราฟ 1: Stock Quantity (Bar Chart)
        const stockData = {
          labels: books.map(book => book.title.length > 20 ? book.title.substring(0, 20) + '...' : book.title),
          datasets: [
            {
              label: 'Stock Quantity',
              data: books.map(book => book.stock),
              backgroundColor: 'rgba(53, 162, 235, 0.6)',
              borderColor: 'rgba(53, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        };
        setChartData(stockData);

        // กราฟ 2: Books by Category (Pie Chart)
        const categoryMap = {};
        books.forEach(book => {
          const catName = book.category?.name || 'Uncategorized';
          categoryMap[catName] = (categoryMap[catName] || 0) + 1;
        });

        const categoryColors = [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ];

        const catData = {
          labels: Object.keys(categoryMap),
          datasets: [
            {
              label: 'Books Count',
              data: Object.values(categoryMap),
              backgroundColor: categoryColors,
              borderColor: categoryColors.map(c => c.replace('0.6', '1')),
              borderWidth: 1,
            },
          ],
        };
        setCategoryData(catData);

        // กราฟ 3: Price Distribution (Line Chart)
        const sortedBooks = [...books].sort((a, b) => a.price - b.price);
        const lineData = {
          labels: sortedBooks.map(book => book.title.length > 15 ? book.title.substring(0, 15) + '...' : book.title),
          datasets: [
            {
              label: 'Price ($)',
              data: sortedBooks.map(book => book.price),
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              tension: 0.4,
              fill: true,
            },
          ],
        };
        setPriceData(lineData);

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { position: 'top' },
    },
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" tip="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div style={{ padding: '12px', width: '100%', overflowY: 'auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>📊 Dashboard</h2>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Books"
              value={statistics.totalBooks}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Value"
              value={statistics.totalValue}
              prefix={<DollarOutlined />}
              precision={2}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Stock"
              value={statistics.totalStock}
              prefix={<AppstoreOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Likes"
              value={statistics.totalLikes}
              prefix={<HeartOutlined />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]}>
        {/* Stock Chart */}
        <Col xs={24} lg={12}>
          <Card title="📦 Stock Levels by Book" bordered={false}>
            {chartData && <Bar options={chartOptions} data={chartData} />}
          </Card>
        </Col>

        {/* Category Chart */}
        <Col xs={24} lg={12}>
          <Card title="📚 Books by Category" bordered={false}>
            {categoryData && <Pie options={chartOptions} data={categoryData} />}
          </Card>
        </Col>

        {/* Price Chart */}
        <Col xs={24}>
          <Card title="💰 Price Distribution" bordered={false}>
            {priceData && <Line options={chartOptions} data={priceData} />}
          </Card>
        </Col>
      </Row>
    </div>
  );
}