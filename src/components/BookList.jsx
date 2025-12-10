import { Table, Button, Space, Popconfirm, Tag, Image } from 'antd';
import { useNavigate } from 'react-router-dom';
import { BulbOutlined } from '@ant-design/icons';

export default function BookList(props) {
  const navigate = useNavigate();

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 180,
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      width: 150,
      sorter: (a, b) => a.author.localeCompare(b.author),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      render: (text) => (
        <div style={{
          maxWidth: '200px',
          wordWrap: 'break-word',
          whiteSpace: 'normal',
          lineHeight: '1.5'
        }}>
          {text || '-'}
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'ISBN',
      dataIndex: 'isbn',
      key: 'isbn',
      width: 140,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      width: 80,
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: "Cover",
      dataIndex: 'coverUrl',
      width: 100,
      align: 'center', // จัดกึ่งกลางคอลัมน์
      render: (text) => (
        <Image
          src={`http://localhost:3080/${text}`}

          // 1. กำหนดขนาดที่แน่นอน
          width={80}
          height={120}

          // 2. ปรับ Style ให้ภาพไม่บีบ (สำคัญ)
          style={{
            objectFit: 'cover', // ตัดส่วนเกินออก รักษาอัตราส่วน
            borderRadius: '6px', // มุมมนนิดหน่อยให้ดูสวย
            border: '1px solid #f0f0f0' // ใส่ขอบบางๆ กันภาพกลืนกับพื้นหลัง
          }}

          fallback="https://placehold.co/80x120?text=No+Image" // รูปสำรองถ้าหาไม่เจอ
        />
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (item) => (
        <Tag color="blue">{item ? item.name : '-'}</Tag>
      ),
    },
    {
      title: 'Liked',
      dataIndex: 'likeCount',
      key: 'likeCount',
      width: 80,
      sorter: (a, b) => (a.likeCount || 0) - (b.likeCount || 0),
    },
    {
      title: 'Action',
      key: 'action',
      width: 250,
      render: (text, record) => (
        <Space size="small" wrap>
          <Button type="primary" onClick={() => props.onLiked(record)} size="small">Like</Button>
          <Button onClick={() => navigate(`/books/edit/${record.id}`)} size="small">Edit</Button>
          <Button
            icon={<BulbOutlined />}
            onClick={() => props.onAskAI && props.onAskAI(record)}
            size="small"
            title="Ask AI about this book"
          >
            AI
          </Button>
          <Popconfirm title="Are you sure?" onConfirm={() => props.onDeleted(record.id)}>
            <Button danger size="small">Delete</Button>
          </Popconfirm>
        </Space>
      ),
    }
  ]

  return (
    <Table
      rowKey="id"
      dataSource={props.data}
      columns={columns}

      // ✅ เพิ่มบรรทัดนี้: ถ้าตารางกว้างเกิน ให้ขึ้น scrollbar ที่ตัวตารางแทน
      scroll={{ x: 'max-content', y: 600 }}

      pagination={{ pageSize: 5 }}
    />
  )
}