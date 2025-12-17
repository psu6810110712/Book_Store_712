import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Spin, Table, Tag, Button, DatePicker, Select, Space } from 'antd';
import { BookOutlined, DollarOutlined, AppstoreOutlined, WarningOutlined, FileTextOutlined, TrophyOutlined, BarChartOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useLanguage } from './contexts/LanguageContext';

const { RangePicker } = DatePicker;

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  ChartTitle,
  Tooltip,
  Legend
);

export default function DashboardScreen() {
  const [chartData, setChartData] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [books, setBooks] = useState([]);
  const [statistics, setStatistics] = useState({
    totalBooks: 0,
    totalValue: 0,
    totalStock: 0,
    totalLikes: 0,
    lowStockItems: 0,
  });
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/book');
      const booksData = response.data;
      setBooks(booksData);

      // Calculate statistics
      const totalBooks = booksData.length;
      const totalValue = booksData.reduce((sum, book) => sum + (book.price * book.stock), 0);
      const totalStock = booksData.reduce((sum, book) => sum + book.stock, 0);
      const totalLikes = booksData.reduce((sum, book) => sum + (book.likes || 0), 0);
      const lowStockItems = booksData.filter(book => book.stock < 10).length;

      setStatistics({ totalBooks, totalValue, totalStock, totalLikes, lowStockItems });

      // Chart 1: Stock Quantity (Bar Chart)
      const stockData = {
        labels: booksData.map(book => book.title.length > 20 ? book.title.substring(0, 20) + '...' : book.title),
        datasets: [
          {
            label: t('stockQty'),
            data: booksData.map(book => book.stock),
            backgroundColor: 'rgba(53, 162, 235, 0.6)',
            borderColor: 'rgba(53, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      };
      setChartData(stockData);

      // Chart 2: Books by Category (Pie Chart) - FIXED
      const categoryMap = {};
      booksData.forEach(book => {
        // Check multiple possible field names for category
        const catName = book.book_category_name
          || (book.category && typeof book.category === 'object' ? book.category.name : null)
          || book.category_name
          || 'Uncategorized';
        if (categoryMap[catName]) {
          categoryMap[catName]++;
        } else {
          categoryMap[catName] = 1;
        }
      });

      const categories = Object.keys(categoryMap);
      const categoryCounts = Object.values(categoryMap);

      const categoryColors = [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)',
        'rgba(199, 199, 199, 0.8)',
        'rgba(83, 102, 255, 0.8)',
      ];

      const catData = {
        labels: categories,
        datasets: [
          {
            label: t('numBooks'),
            data: categoryCounts,
            backgroundColor: categoryColors.slice(0, categories.length),
            borderColor: categoryColors.slice(0, categories.length).map(c => c.replace('0.8', '1')),
            borderWidth: 2,
          },
        ],
      };
      setCategoryData(catData);

    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Best sellers table
  const bestSellers = [...books]
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 10);

  const bestSellersColumns = [
    {
      title: t('rank'),
      key: 'rank',
      width: 80,
      render: (_, __, index) => (
        <Tag color={index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : 'blue'}>
          #{index + 1}
        </Tag>
      ),
    },
    {
      title: t('title'),
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: t('author'),
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: t('liked'),
      dataIndex: 'likes',
      key: 'likes',
      sorter: (a, b) => (b.likes || 0) - (a.likes || 0),
      render: (likes) => <Tag color="red">❤️ {likes || 0}</Tag>,
    },
    {
      title: t('stock'),
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: t('value'),
      key: 'value',
      render: (_, record) => `$${(record.price * record.stock).toFixed(2)}`,
    },
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 15,
          font: {
            size: 12
          }
        }
      },
    },
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" tip={t('loading')} />
      </div>
    );
  }

  return (
    <div style={{ padding: '12px', width: '100%', overflowY: 'auto' }}>
      {/* Header with Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>
          <BarChartOutlined /> {t('dashboardTitle')}
        </h2>
        <Space>
          <RangePicker />
          <Select defaultValue="all" style={{ width: 150 }}>
            <Select.Option value="all">{t('allCategories')}</Select.Option>
          </Select>
          <Button type="primary" icon={<FileTextOutlined />}>
            {t('exportPDF')}
          </Button>
        </Space>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('totalBooks')}
              value={statistics.totalBooks}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('inventoryValue')}
              value={statistics.totalValue}
              prefix={<DollarOutlined />}
              precision={2}
              suffix="$"
              valueStyle={{ color: '#33bcb7' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('totalStock')}
              value={statistics.totalStock}
              prefix={<AppstoreOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('lowStockItems')}
              value={statistics.lowStockItems}
              prefix={<WarningOutlined />}
              valueStyle={{ color: statistics.lowStockItems > 0 ? '#cf1322' : '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} lg={12}>
          <Card title={`📦 ${t('stockLevels')}`} bordered={false}>
            {chartData && <Bar options={chartOptions} data={chartData} />}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title={`📚 ${t('booksByCategory')}`} bordered={false}>
            {categoryData && <Pie options={chartOptions} data={categoryData} />}
          </Card>
        </Col>
      </Row>

      {/* Best Sellers Table */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card
            title={
              <Space>
                <TrophyOutlined style={{ color: '#faad14' }} />
                <span>{t('topBestSellers')}</span>
              </Space>
            }
            bordered={false}
          >
            <Table
              columns={bestSellersColumns}
              dataSource={bestSellers}
              rowKey="id"
              pagination={false}
              size="small"
              scroll={{ x: 800 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}