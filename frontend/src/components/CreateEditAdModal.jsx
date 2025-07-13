import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  message,
  Button,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import "../styles/CreateEditAdModal.css";


const { Option } = Select;

const CreateEditAdModal = ({ visible, onClose, ad = null, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { auth } = useContext(AuthContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || "http://localhost:5000";


  const isEdit = !!ad;

  useEffect(() => {
    if (visible) {
      form.setFieldsValue(ad || {});
      if (ad?.imageUrl) {
        setImagePreview(`${IMAGE_BASE_URL}${ad.imageUrl}`);
      } else {
        setImagePreview("");
      }
    } else {
      form.resetFields();
      setSelectedFile(null);
      setImagePreview("");
    }
  }, [visible, ad]);


  const handleFinish = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("category", values.category);
      formData.append("city", values.city);

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      if (isEdit) {
        await api.put(`/ads/${ad._id}`, formData, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        message.success("Ad updated!");
      } else {
        await api.post("/ads", formData, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        message.success("Ad created!");
      }

      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      message.error("Failed to save ad.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (info) => {
    const file = info.file.originFileObj;
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Modal
      open={visible}
      title={isEdit ? "Edit Ad" : "Create Ad"}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} className="ad-modal-form">
        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Description" name="description" rules={[{ required: true }]}>
          <Input.TextArea />
        </Form.Item>

        <Form.Item label="Image">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setSelectedFile(file);
                const reader = new FileReader();
                reader.onload = (e) => setImagePreview(e.target.result);
                reader.readAsDataURL(file);
              }
            }}
          className="styled-upload"

          />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" style={{ marginTop: 10, maxWidth: "100%" }} />
          )}
        </Form.Item>


        <Form.Item label="Price" name="price" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Category" name="category" rules={[{ required: true }]}>
          <Select>
            {[
              "clothing",
              "tools",
              "sports",
              "accessories",
              "furniture",
              "pets",
              "games",
              "books",
              "technology",
            ].map((cat) => (
              <Option key={cat} value={cat}>
                {cat}
              </Option>
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
