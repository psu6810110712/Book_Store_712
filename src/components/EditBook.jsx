import { Modal, Form, Input, InputNumber, Select } from 'antd';
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
        // ส่งข้อมูลที่แก้แล้วกลับไปให้แม่ (BookScreen)
        props.onSave(values);
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
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
      >
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="author" label="Author" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="price" label="Price" rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="categoryId" label="Category" rules={[{ required: true }]}>
           {/* รับ categories มาจาก props แทนการดึงเอง */}
          <Select options={props.categories} />
        </Form.Item>
      </Form>
    </Modal>
  );
}