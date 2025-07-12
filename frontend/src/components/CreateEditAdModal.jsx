import { Modal, Form, Input, Select, InputNumber, message } from "antd";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const { Option } = Select;

const CreateEditAdModal = ({ visible, onClose, ad = null, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { auth } = useContext(AuthContext);

  const isEdit = !!ad;

useEffect(() => {
  if (visible) {
    form.setFieldsValue(ad || {});
  } else {
    form.resetFields();
  }
}, [visible, ad]);


  const handleFinish = async (values) => {
    try {
      setLoading(true);
      if (isEdit) {
        await api.put(`/ads/${ad._id}`, values, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        message.success("Ad updated!");
      } else {
        await api.post("/ads", values, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        message.success("Ad created!");
      }
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      message.error("Failed to save ad.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      title={isEdit ? "Edit Ad" : "Create Ad"}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={ad || {}}>
        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="description" rules={[{ required: true }]}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Image URL" name="imageUrl" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Price" name="price" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Category" name="category" rules={[{ required: true }]}>
          <Select>
            {["clothing", "tools", "sports", "accessories", "furniture", "pets", "games", "books", "technology"].map((cat) => (
              <Option key={cat} value={cat}>{cat}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="City" name="city" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateEditAdModal;
