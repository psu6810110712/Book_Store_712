import { Modal, Form, Input, InputNumber, Select, Row, Col } from 'antd';
import { useEffect } from 'react';

export default function EditBook(props) {
  const [form] = Form.useForm();

  // เมื่อมีการเปิด Modal หรือเปลี่ยนข้อมูลหนังสือที่เลือก (props.item)
  useEffect(() => {
    if (props.isOpen && props.item) {
      // ตั้งค่าฟอร์มด้วยข้อมูลเดิม
      // หมายเหตุ: ต้องแปลง category เป็น categoryId เพื่อให้ Select แสดงผลถูกต้อง
      form.setFieldsValue({
        ...props.item,
        categoryId: props.item.category?.id
      });
    }
  }, [props.isOpen, props.item, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        // รวม id จาก props.item เข้าไปด้วย เพื่อให้ BookScreen รู้ว่าจะ update record ไหน
        const updatedData = {
          ...values,
          id: props.item.id
        };
        // ส่งข้อมูลที่แก้แล้วกลับไปให้แม่ (BookScreen)
        props.onSave(updatedData);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title="Edit Book"
      open={props.isOpen}
      onOk={handleOk}
      onCancel={props.onCancel}
      okText="Save"
      cancelText="Cancel"
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
      >
        {/* จัด Title กับ Author ให้อยู่บรรทัดเดียวกัน */}
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

        {/* เพิ่ม Description */}
        <Form.Item name="description" label="Description">
          <Input.TextArea rows={2} placeholder="Brief description..." />
        </Form.Item>

        {/* Price, Stock, และ Category ในบรรทัดเดียวกัน */}
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

        {/* เพิ่ม ISBN */}
        <Form.Item name="isbn" label="ISBN">
          <Input placeholder="Enter ISBN" />
        </Form.Item>

        {/* เพิ่มช่องใส่ Link รูปภาพ */}
        <Form.Item name="coverUrl" label="Cover Image URL">
          <Input placeholder="e.g. https://example.com/image.jpg" />
        </Form.Item>

      </Form>
    </Modal>
  );
}