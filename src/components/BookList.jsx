import { Table, Button, Space, Popconfirm, Tag, Image } from 'antd';
import { useNavigate } from 'react-router-dom';
import { BulbOutlined } from '@ant-design/icons';
import { useLanguage } from '../contexts/LanguageContext';

export default function BookList(props) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const columns = [
    {
      title: t('title'),
      dataIndex: 'title',
      key: 'title',
      width: 180,
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: t('author'),
      dataIndex: 'author',
      key: 'author',
      width: 150,
      sorter: (a, b) => a.author.localeCompare(b.author),
    },
    {
      title: t('description'),
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
      title: t('price'),
      dataIndex: 'price',
      key: 'price',
      width: 100,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: t('isbn'),
      dataIndex: 'isbn',
      key: 'isbn',
      width: 140,
    },
    {
      title: t('stock'),
      dataIndex: 'stock',
      key: 'stock',
      width: 80,
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: t('cover'),
      dataIndex: 'coverUrl',
      width: 100,
      align: 'center',
      render: (text) => (
        <Image
          src={`http://localhost:3080/${text}`}
          width={80}
          height={120}
          style={{
            objectFit: 'cover',
            borderRadius: '6px',
            border: '1px solid #f0f0f0'
          }}
          fallback="https://placehold.co/80x120?text=No+Image"
        />
      ),
    },
    {
      title: t('category'),
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (item) => (
        <Tag color="blue">{item ? item.name : '-'}</Tag>
      ),
    },
    {
      title: t('liked'),
      dataIndex: 'likeCount',
      key: 'likeCount',
      width: 80,
      sorter: (a, b) => (a.likeCount || 0) - (b.likeCount || 0),
    },
    {
      title: t('action'),
      key: 'action',
      width: 250,
      render: (text, record) => (
        <Space size="small" wrap>
          <Button type="primary" onClick={() => props.onLiked(record)} size="small">{t('like')}</Button>
          <Button onClick={() => navigate(`/books/edit/${record.id}`)} size="small">{t('edit')}</Button>
          <Button
            icon={<BulbOutlined />}
            onClick={() => props.onAskAI && props.onAskAI(record)}
            size="small"
            title="Ask AI about this book"
          >
            {t('askAI')}
          </Button>
          <Popconfirm title={t('deleteConfirm')} onConfirm={() => props.onDeleted(record.id)}>
            <Button danger size="small">{t('delete')}</Button>
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
      scroll={{ x: 'max-content' }}
      pagination={{ pageSize: 5 }}
    />
  )
}