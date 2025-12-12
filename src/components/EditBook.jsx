import { Modal, Form, Input, InputNumber, Select, Row, Col, message } from 'antd';
import { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function EditBook(props) {
  const [form] = Form.useForm();
  const { t } = useLanguage();

  // useEffect: Check props.isOpen and use form.setFieldsValue(props.item)
  useEffect(() => {
    if (props.isOpen && props.item) {
      // Set form values with the item data automatically
      form.setFieldsValue({
        ...props.item,
        categoryId: props.item.category?.id // Convert category object to categoryId
      });
    }
  }, [props.isOpen, props.item, form]);

  // handleFormSubmit: Validate form and call props.onSave
  const handleFormSubmit = () => {
    form
      .validateFields()
      .then((formData) => {
        // Call onSave to send data back to BookScreen for server update
        props.onSave(formData);
        message.success(`✅ "${formData.title}" ${t('success')}!`);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title={`📝 ${t('editBook')}`}
      open={props.isOpen}
      onOk={handleFormSubmit}
      onCancel={props.onCancel}
      okText={t('save')}
      cancelText={t('cancel')}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        name="edit_book_form"
      >
        {/* Title and Author - same row */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="title"
              label={t('title')}
              rules={[{ required: true, message: `${t('title')} is required` }]}
            >
              <Input placeholder="Enter title" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="author"
              label={t('author')}
              rules={[{ required: true, message: `${t('author')} is required` }]}
            >
              <Input placeholder="Enter author" />
            </Form.Item>
          </Col>
        </Row>

        {/* Description */}
        <Form.Item name="description" label={t('description')}>
          <Input.TextArea rows={2} placeholder="Brief description..." />
        </Form.Item>

        {/* Price, Stock, Category - same row */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="price"
              label={t('price')}
              rules={[{ required: true, message: `${t('price')} is required` }]}
            >
              <InputNumber style={{ width: '100%' }} min={0} prefix="$" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="stock"
              label={t('stock')}
              rules={[{ required: true, message: `${t('stock')} is required` }]}
            >
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="categoryId"
              label={t('category')}
              rules={[{ required: true, message: `${t('category')} is required` }]}
            >
              <Select
                allowClear
                options={props.categories}
                placeholder="Select"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* ISBN */}
        <Form.Item name="isbn" label={t('isbn')}>
          <Input placeholder="Enter ISBN" />
        </Form.Item>

        {/* Cover Image URL */}
        <Form.Item name="coverUrl" label={`${t('cover')} Image URL`}>
          <Input placeholder="e.g. https://example.com/image.jpg" />
        </Form.Item>

      </Form>
    </Modal>
  );
}