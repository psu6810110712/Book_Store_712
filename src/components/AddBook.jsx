import { Button, Form, Select, Input, InputNumber, Row, Col } from 'antd';

export default function AddBook(props) {
  const [form] = Form.useForm();

  const onFinish = (values) => {
      props.onBookAdded(values);
      form.resetFields(); // ล้างค่าในฟอร์มหลังจากบันทึกเสร็จ
  };

  return (
    // 1. เปลี่ยน layout เป็น vertical
    <Form form={form} layout="vertical" onFinish={onFinish}>
      
      {/* 2. ใช้ Row/Col จัด Title กับ Author ให้อยู่บรรทัดเดียวกัน */}
      <Row gutter={16}>
        <Col span={12}>
            <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                <Input placeholder="Enter title" />
            </Form.Item>
        </Col>
        <Col span={12}>
            <Form.Item name="author" label="Author" rules={[{ required: true }]}>
                <Input placeholder="Enter author" />
            </Form.Item>
        </Col>
      </Row>

      {/* เพิ่ม Description (Optional) */}
      <Form.Item name="description" label="Description">
         <Input.TextArea rows={2} placeholder="Brief description..." />
      </Form.Item>

      <Row gutter={16}>
        <Col span={8}>
            <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
        </Col>
        <Col span={8}>
            <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
        </Col>
        <Col span={8}>
            <Form.Item name="categoryId" label="Category" rules={[{ required: true }]}>
                <Select 
                    allowClear 
                    options={props.categories} 
                    placeholder="Select" 
                />
            </Form.Item>
        </Col>
      </Row>

      {/* 3. เพิ่มช่องใส่ Link รูปภาพ */}
      <Form.Item name="coverUrl" label="Cover Image URL">
        <Input placeholder="e.g. https://example.com/image.jpg" />
      </Form.Item>
      
      {/* 4. ปุ่มกดอันเดียว จัดชิดขวา */}
      <Form.Item style={{ textAlign: 'right', marginTop: '10px' }}>
        <Button type="primary" htmlType="submit">
            Add Book
        </Button>
      </Form.Item>

    </Form>
  )
}