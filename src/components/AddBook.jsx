import { Button, Form, Select, Input, InputNumber } from 'antd';

// ลบ axios และ useState/useEffect ของ categories ออก

export default function AddBook(props) {
  // ไม่ต้อง fetchCategories ที่นี่แล้ว ใช้ props.categories แทน

  return (
    <Form layout="inline" onFinish={values => { props.onBookAdded({ ...values }) }}>
      <Form.Item name="title" label="Title" rules={[{ required: true }]}>
        <Input placeholder="Title" />
      </Form.Item>
      <Form.Item name="author" label="Author" rules={[{ required: true }]}>
        <Input placeholder="Author"/>
      </Form.Item>
      <Form.Item name="price" label="Price" rules={[{ required: true }]}>
        <InputNumber placeholder="Price" min={0} />
      </Form.Item>
      <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
        <InputNumber placeholder="Stock" min={0} />
      </Form.Item>
      
      <Form.Item name="categoryId" label="Category" rules={[{ required: true }]}>
        <Select 
            allowClear 
            style={{ width: "150px" }} 
            options={props.categories} 
            placeholder="Category"
        />
      </Form.Item>
      
      <Form.Item>
        <Button type="primary" htmlType="submit">New Book</Button>
      </Form.Item>
    </Form>
  )
}