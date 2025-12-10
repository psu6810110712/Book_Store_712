import { Table, Button, Space, Popconfirm, Tag, Image } from 'antd';

export default function BookList(props) {

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      sorter: (a, b) => a.author.localeCompare(b.author),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'ISBN',
      dataIndex: 'isbn',
      key: 'isbn',
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: "Cover",
      dataIndex: 'coverUrl',
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
      render: (item) => (
        <Tag color="blue">{item ? item.name : '-'}</Tag>
      ),
    },
    {
      title: 'Liked',
      dataIndex: 'likeCount',
      key: 'likeCount',
      sorter: (a, b) => (a.likeCount || 0) - (b.likeCount || 0),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="small">
          <Button type="primary" onClick={() => props.onLiked(record)}>Like</Button>
          <Button onClick={() => props.onEdit(record)}>Edit</Button>
          <Popconfirm title="Are you sure?" onConfirm={() => props.onDeleted(record.id)}>
            <Button danger>Delete</Button> {/* ใช้ปุ่มธรรมดา (ไม่ต้อง dashed) จะดูเต็มกว่า */}
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
      scroll={{ x: true }}

      pagination={{ pageSize: 5 }}
    // ...
    />
  )
}