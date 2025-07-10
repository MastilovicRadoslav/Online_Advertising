import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
    Table,
    Input,
    Select,
    Checkbox,
    Pagination,
    Button,
    Space,
    message
} from 'antd'
import './HomePage.css'

const { Search } = Input
const { Option } = Select

const HomePage = () => {
    const [ads, setAds] = useState([])
    const [loading, setLoading] = useState(false)
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        minPrice: '',
        maxPrice: '',
        mineOnly: false,
        page: 1,
        limit: 20
    })
    const [totalAds, setTotalAds] = useState(0)

    const fetchAds = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/ads`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    search: filters.search,
                    category: filters.category,
                    minPrice: filters.minPrice,
                    maxPrice: filters.maxPrice,
                    mine: filters.mineOnly,
                    page: filters.page,
                    limit: filters.limit
                }
            })
            setAds(res.data.ads)
            setTotalAds(res.data.total)
        } catch (err) {
            message.error('Greška pri učitavanju oglasa.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAds()
    }, [filters])

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token')
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/ads/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            message.success('Oglas obrisan.')
            fetchAds()
        } catch {
            message.error('Brisanje nije uspjelo.')
        }
    }

    const columns = [
        {
            title: 'Slika',
            dataIndex: 'imageUrl',
            render: (url) => <img src={url} alt="ad" width={60} />
        },
        { title: 'Naziv', dataIndex: 'title' },
        { title: 'Cijena', dataIndex: 'price' },
        { title: 'Grad', dataIndex: 'city' },
        { title: 'Kategorija', dataIndex: 'category' },
        {
            title: 'Akcije',
            render: (_, record) => {
                const loggedInUsername = localStorage.getItem('username')
                if (record.user.username !== loggedInUsername) return null
                return (
                    <Space>
                        <Button danger onClick={() => handleDelete(record._id)}>
                            Obriši
                        </Button>
                        <Button onClick={() => console.log('Edit ID:', record._id)}>
                            Izmeni
                        </Button>
                    </Space>
                )
            }
        }
    ]

    return (
        <div className="home-container">
            <h2>Oglasi</h2>

            <div className="filters">
                <Search
                    placeholder="Pretraga po nazivu"
                    onSearch={(val) => setFilters({ ...filters, search: val, page: 1 })}
                    enterButton
                />
                <Select
                    placeholder="Kategorija"
                    onChange={(val) => setFilters({ ...filters, category: val, page: 1 })}
                    allowClear
                    style={{ width: 200 }}
                >
                    <Option value="clothing">Clothing</Option>
                    <Option value="tools">Tools</Option>
                    <Option value="sports">Sports</Option>
                    <Option value="accessories">Accessories</Option>
                    <Option value="furniture">Furniture</Option>
                    <Option value="pets">Pets</Option>
                    <Option value="games">Games</Option>
                    <Option value="books">Books</Option>
                    <Option value="technology">Technology</Option>
                </Select>
                <Input
                    placeholder="Min cijena"
                    type="number"
                    onChange={(e) =>
                        setFilters({ ...filters, minPrice: e.target.value, page: 1 })
                    }
                    style={{ width: 120 }}
                />
                <Input
                    placeholder="Max cijena"
                    type="number"
                    onChange={(e) =>
                        setFilters({ ...filters, maxPrice: e.target.value, page: 1 })
                    }
                    style={{ width: 120 }}
                />
                <Checkbox
                    checked={filters.mineOnly}
                    onChange={(e) =>
                        setFilters({ ...filters, mineOnly: e.target.checked, page: 1 })
                    }
                >
                    Prikaži samo moje
                </Checkbox>
            </div>

            <Table
                columns={columns}
                dataSource={ads}
                rowKey="_id"
                loading={loading}
                pagination={false}
            />

            <Pagination
                current={filters.page}
                pageSize={filters.limit}
                total={totalAds}
                onChange={(page) => setFilters({ ...filters, page })}
                className="center-pagination"
            />
        </div>
    )
}

export default HomePage
