// src/DashboardScreen.jsx
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import axios from 'axios';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardScreen() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ดึงข้อมูลหนังสือจาก Server
        const response = await axios.get('/api/book');
        const books = response.data;

        // เตรียมข้อมูลกราฟ
        const data = {
          labels: books.map(book => book.title), // แกน X: ชื่อหนังสือ
          datasets: [
            {
              label: 'Stock Quantity',
              data: books.map(book => book.stock), // แกน Y: จำนวน Stock
              backgroundColor: 'rgba(53, 162, 235, 0.6)',
              borderColor: 'rgba(53, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        };
        setChartData(data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Stock Statistics' },
    },
  };

  return (
    <div style={{ padding: '20px', width: '100%' }}>
      <h2 style={{ textAlign: 'center' }}>Dashboard</h2>
      {chartData ? <Bar options={options} data={chartData} /> : <p style={{textAlign: 'center'}}>Loading chart...</p>}
    </div>
  );
}