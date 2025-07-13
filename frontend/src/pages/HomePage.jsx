import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
    Table,
    Input,
    Select,
    Button,
    Checkbox,
    Row,
    Col,
    Form,
    message,
} from "antd";
import api from "../services/api";
import CreateEditAdModal from "../components/CreateEditAdModal";
import "../styles/HomePage.css";

const { Option } = Select;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || "http://localhost:5000";

const categories = [
    "clothing", "tools", "sports", "accessories",
    "furniture", "pets", "games", "books", "technology"
];

const HomePage = () => {
    const { auth } = useContext(AuthContext);

    const [ads, setAds] = useState([]);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState({
        search: "",
        category: "",
        minPrice: "",
        maxPrice: "",
        mineOnly: false,
    });
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [editAd, setEditAd] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchAds();
    }, [filters, page, auth.token]);

    const fetchAds = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                search: filters.search || undefined,
                category: filters.category || undefined,
                minPrice: filters.minPrice || undefined,
                maxPrice: filters.maxPrice || undefined,
            };

            if (filters.mineOnly && auth.token) {
                params.mineOnly = "true";
            }

            const config = { params };

            if (auth.token) {
                config.headers = {
                    Authorization: `Bearer ${auth.token}`,
                };
            }

            const res = await api.get("/ads", config);
            setAds(res.data.ads);
            setTotal(res.data.total);
        } catch (err) {
            console.error("Fetch error:", err);
            message.error("Failed to fetch ads.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/ads/${id}`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            message.success("Ad deleted.");
            fetchAds();
        } catch {
            message.error("Failed to delete ad.");
        }
    };

    const handleEdit = (ad) => {
        setEditAd(ad);
        setModalVisible(true);
    };

    const columns = [
        {
            title: "Image",
            dataIndex: "imageUrl",
            render: (url) => {
                const fullUrl = `${IMAGE_BASE_URL}${url}`;
                console.log("Full image URL:", fullUrl); //

                return url ? (
                    <img
                        src={fullUrl}
                        alt="Ad"
                        style={{ width: 80, objectFit: "cover" }}
                    />
                ) : (
                    <span>No image</span>
                );
            },
        },
        {
            title: "Title",
            dataIndex: "title",
            render: (text, record) => (
                <a onClick={() => window.location.href = `/ads/${record._id}`}>{text}</a>
            ),
        },
        {
            title: "Price",
            dataIndex: "price",
            render: (p) => `${p} €`,
        },
        {
            title: "City",
            dataIndex: "city",
        },
        {
            title: "Category",
            dataIndex: "category",
        },
        {
            title: "Actions",
            dataIndex: "_id",
            render: (id, record) =>
                auth.userId && record.user && record.user._id === auth.userId && (
                    <>
                        <Button type="link" onClick={() => handleEdit(record)}>
                            Edit
                        </Button>
                        <Button type="link" danger onClick={() => handleDelete(id)}>
                            Delete
                        </Button>
                    </>
                ),
        },
    ];

    const onFilterChange = (changedValues) => {
        setFilters({ ...filters, ...changedValues });
        setPage(1);
    };

    return (
        <div className="homepage-container">
            {!auth.token && (
                <div style={{ marginBottom: 20, textAlign: "center", backgroundColor: "#fffbe6", padding: "10px", border: "1px solid #ffe58f", borderRadius: 4 }}>
                    <strong>To access more features like creating, editing and deleting ads, please register and log in.</strong>
                </div>
            )}
            <Form layout="vertical" onValuesChange={onFilterChange} initialValues={filters} className="homepage-form">
                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item label="Search" name="search">
                            <Input placeholder="Search by title" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="Category" name="category">
                            <Select allowClear placeholder="Select category">
                                {categories.map((cat) => (
                                    <Option key={cat} value={cat}>{cat}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item label="Min Price" name="minPrice">
                            <Input type="number" />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item label="Max Price" name="maxPrice">
                            <Input type="number" />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item label=" " name="mineOnly" valuePropName="checked">
                            <Checkbox disabled={!auth.token}>Show mine only</Checkbox>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>

            <Table
                rowKey="_id"
                dataSource={ads}
                columns={columns}
                loading={loading}
                pagination={{
                    current: page,
                    pageSize: 20,
                    total,
                    onChange: (p) => setPage(p),
                }}
            />

            <CreateEditAdModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                ad={editAd}
                onSuccess={fetchAds}
            />
        </div>
    );
};

export default HomePage;
