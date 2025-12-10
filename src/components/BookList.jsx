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
      render: (text) => (
        <Image
          src={`http://localhost:3080/${text}`}
          height={100} 
          fallback="https://via.placeholder.com/150" // ใส่กันเหนียวเผื่อรูปเสีย
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
      pagination={{ pageSize: 5 }}
      scroll={{ x: 1000 }} 
      rowClassName={(record, index) => {
        if (record.stock < 30) {
          return "red-row";
        }
      }} 
    />
  )
}