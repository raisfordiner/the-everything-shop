import './Header.css'
import { SearchOutlined, UserOutlined, ShoppingCartOutlined, DownOutlined, TruckOutlined, DropboxOutlined, LogoutOutlined, MenuOutlined } from '@ant-design/icons'
import {
    Input,
    Flex,
    Button,
    Divider,
    Grid,
    Row,
    Col,
    message,
    Menu,
    Avatar,
    Dropdown,
    AutoComplete,
    Typography
} from 'antd'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import authService from "../../services/authService.js";
import { setLogout } from "../../redux/actions/authAction.js";
import productService from "../../services/productService.js";
import { useEffect, useState, useRef } from "react";
import categoryService from "../../services/categoryService.js";
import { setCategories } from "../../redux/actions/categoryAction.js";
import SearchSuggestion from './SearchSuggestion.jsx';
const { Search } = Input;
const { Text} = Typography;

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [messageApi, contextHolder] = message.useMessage();
    const [searchValue, setSearchValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchContainerRef = useRef(null);

    const { isAuthenticated, user } = useSelector((state) => state.authReducer);

    const categories = useSelector((state) => state.allCategories.categories);

    const [options, setOptions] = useState([]);
    
    // Handle click outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categories = await categoryService.getAllCategoriesSimple();
                dispatch(setCategories(categories.data))
            }
            catch (error) {
                console.error(error)
            }
        }
        fetchCategories()
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchValue.trim()) {
                try {
                    const response = await productService.getAllProducts({ search: searchValue, take: 5 });

                    if (response?.data?.products) {
                        const searchOptions = response.data.products.map(product => ({
                            value: product.name,
                            key: product.id,
                            label: (
                                <div className="search-suggestion-item">
                                    <Avatar
                                        shape="square"
                                        size={48}
                                        src={product.images[0]}
                                        style={{ marginRight: 10, flexShrink: 0 }}
                                    />
                                    <div className="search-suggestion-info">
                                        <Text strong ellipsis className="product-name">{product.name}</Text>
                                        <Text type="danger" className="product-price">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                        </Text>
                                    </div>
                                </div>
                            ),
                        }));
                        setOptions(searchOptions);
                    }
                } catch (error) {
                    console.error("Search error:", error);
                }
            } else {
                setOptions([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchValue]);

    const handleLogout = async () => {
        try {
            await authService.logout();
            dispatch(setLogout());
            messageApi.open({
                type: 'success',
                content: 'Log out successfully!',
            });
        }
        catch (error) {
            console.error(error);
            messageApi.open({
                type: 'error',
                content: 'Log out failed',
            });
        }
    }

    const onSelect = (value, option) => {
        navigate(`/products/${option.key}`);
        ("");
    };

    const onSearchSubmit = (value) => {
        if (value && value.trim()) {
            navigate(`/search?key=${encodeURIComponent(value.trim())}`);
        }
    };

    const handleSearch = (value) => {
        if (value.trim()) {
            navigate(`/search?key=${encodeURIComponent(value.trim())}`);
            setSearchValue('');
            setShowSuggestions(false);
        }
    };

    const handleSearchInputChange = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        setShowSuggestions(value.length >= 2);
    };

    const handleSearchFocus = () => {
        if (searchValue.length >= 2) {
            setShowSuggestions(true);
        }
    };

    const userMenu = {
        items: [
            {
                key: 'profile',
                icon: <UserOutlined />,
                label: <Link to="/profile">Profile</Link>
            },
            {
                key: 'logout',
                icon: <LogoutOutlined />,
                label: 'Logout',
                onClick: handleLogout
            }
        ]
    };

    const categoryMenu = {
        items: categories.map(category => ({
            key: category.id,
            label: <Link to={`/category/${category.id}`}>{category.name}</Link>,
        }))
    }

    return (
        <div className='header'>
            {contextHolder}
            {/* <div className="header__upper">
                <div className="upper__left">
                    <span>Welcome to my everything-shop!</span>
                </div>
                <div className='upper__right'>
                    <span>
                        <DownOutlined className='icon' />
                        Deliver 000000
                    </span>
                    <span>
                        <TruckOutlined className='icon' />
                        Track your order
                    </span>
                    <span>
                        <DropboxOutlined className='icon' />
                        All offers
                    </span>
                </div>
            </div> */}
            <Row className="header__middle" gutter={[16, 16]}>
                <Col xs={24} sm={24} md={6} lg={6}>
                    <Link to="/" className="logo">
                        <span className="logo-full">EVERYTHING SHOP</span>
                        <span className="logo-short">E-SHOP</span>
                    </Link>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12}>
                    <div style={{position: 'relative', width: '100%'}}>
                        <AutoComplete
                            popupMatchSelectWidth={true}
                            style={{width: '100%'}}
                            options={options}
                            onSelect={onSelect}
                            onSearch={(text) => setSearchValue(text)}
                            value={searchValue}
                            defaultActiveFirstOption={false}
                        >
                            <Input.Search
                                placeholder="Search essentials, groceries and more..."
                                enterButton
                                size="large"
                                onSearch={onSearchSubmit}
                            />
                        </AutoComplete>
                    </div>
                </Col>
                <Col xs={24} sm={24} md={6} lg={6}>
                    <div className="middle__right">
                        {isAuthenticated ? (
                            <>
                                <Link to="/cart" className="header-action-item">
                                    <ShoppingCartOutlined className="icon"/>
                                    <span className="action-text">Cart</span>
                                </Link>

                                <Link to="/orders" className="header-action-item">
                                    <DropboxOutlined className="icon"/>
                                    <span className="action-text">Orders</span>
                                </Link>

                                <Divider type="vertical" style={{
                                    height: "20px",
                                    borderLeft: "1px solid #d9d9d9", margin: "0", alignSelf: "center" }} className="action-divider" />

                                <Dropdown menu={userMenu} placement="bottomLeft" arrow>
                                    <a onClick={(e) => e.preventDefault()} className="user-menu-trigger">
                                        <UserOutlined className="icon" />
                                        <span className="action-text">{user?.username || 'User'}</span>
                                    </a>
                                </Dropdown>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="header-action-item">
                                    <UserOutlined className="icon" />
                                    <span className="action-text">Sign Up/Sign In</span>
                                </Link>
                            </>
                        )}
                    </div>
                </Col>
            </Row>
            <Row className="header__lower">
                <Dropdown menu={categoryMenu} trigger={['hover']} placement={"bottomLeft"} arrow>
                    <Button icon={<MenuOutlined />} style={{ border: "none", padding: "0", boxShadow: "none" }}>
                        All Categories
                    </Button>
                </Dropdown>
            </Row>
        </div>
    );
}

export default Header;
