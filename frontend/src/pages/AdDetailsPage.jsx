import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { Typography, Button, Descriptions, Image, message, Spin } from "antd";
import dayjs from "dayjs";
import CreateEditAdModal from "../components/CreateEditAdModal";
import "../styles/AdDetailsPage.css";

const { Title } = Typography;

const AdDetailsPage = () => {
  const { id } = useParams();
  const { auth } = useContext(AuthContext);

  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchAd = async () => {
    setLoading(true);
    try {
      const config = {};
      if (auth.token) {
        config.headers = { Authorization: `Bearer ${auth.token}` };
      }

      const res = await api.get(`/ads/${id}`, config);
      setAd(res.data);
    } catch (err) {
      message.error("Failed to fetch ad.");
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async () => {
    try {
      await api.delete(`/ads/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      message.success("Ad deleted.");
      window.location.href = "/";
    } catch {
      message.error("Failed to delete ad.");
    }
  };

  useEffect(() => {
    fetchAd();
  }, [id]);

  if (loading) {
    return <div className="ad-details-spinner"><Spin /></div>;
  }

  if (!ad) return null;

  const isOwner = ad.user?._id === auth.userId;

  return (
    <div className="ad-details-container">
      <Title level={2}>{ad.title}</Title>

      <Image src={ad.imageUrl} alt="Ad" width={300} />

      <Descriptions bordered column={1} className="ad-details-description">
        <Descriptions.Item label="Description">{ad.description}</Descriptions.Item>
        <Descriptions.Item label="Price">{ad.price} €</Descriptions.Item>
        <Descriptions.Item label="Category">{ad.category}</Descriptions.Item>
        <Descriptions.Item label="City">{ad.city}</Descriptions.Item>
        <Descriptions.Item label="Posted on">{dayjs(ad.createdAt).format("DD.MM.YYYY HH:mm")}</Descriptions.Item>
        <Descriptions.Item label="Posted by">{ad.user.username}</Descriptions.Item>
        <Descriptions.Item label="Phone">{ad.user.phone}</Descriptions.Item>
      </Descriptions>

      {isOwner && (
        <div className="ad-details-actions">
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            Edit
          </Button>
          <Button danger onClick={handleDelete}>
            Delete
          </Button>
        </div>
      )}

      <CreateEditAdModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        ad={ad}
        onSuccess={fetchAd}
      />
    </div>
  );
};

export default AdDetailsPage;
