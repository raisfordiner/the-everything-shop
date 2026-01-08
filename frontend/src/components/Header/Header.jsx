import './Header.css'
import { SearchOutlined, UserOutlined, ShoppingCartOutlined, DownOutlined, TruckOutlined, DropboxOutlined, LogoutOutlined, MenuOutlined } from '@ant-design/icons'
import { Input, Flex, Button, Divider, Grid, Row, Col, message, Menu, Avatar, Dropdown } from 'antd'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import authService from "../../services/authService.js";
import { setLogout } from "../../redux/actions/authAction.js";
import { useEffect, useState, useRef } from "react";
import categoryService from "../../services/categoryService.js";
import { setCategories } from "../../redux/actions/categoryAction.js";
import SearchSuggestion from './SearchSuggestion.jsx';
const { Search } = Input;

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [messageApi, contextHolder] = message.useMessage();
    const [searchValue, setSearchValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchContainerRef = useRef(null);

    const { isAuthenticated, user } = useSelector((state) => state.authReducer);

    const categories = useSelector((state) => state.allCategories.categories);

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
                    <div className="search-wrapper" ref={searchContainerRef}>
                        <Search 
                            placeholder="Search essentials, groceries and more..." 
                            enterButton 
                            value={searchValue}
                            onChange={handleSearchInputChange}
                            onFocus={handleSearchFocus}
                            onSearch={handleSearch}
                        />
                        {showSuggestions && (
                            <SearchSuggestion 
                                searchValue={searchValue}
                                onSearch={handleSearch}
                                onClose={() => setShowSuggestions(false)}
                            />
                        )}
                    </div>
                </Col>
                <Col xs={24} sm={24} md={6} lg={6}>
                    <div className="middle__right">
                        {isAuthenticated ? (
                            <>
                                <Link to="/cart" className="header-action-item">
                                    <ShoppingCartOutlined className="icon" />
                                    <span className="action-text">Cart</span>
                                </Link>

                                <Link to="/orders" className="header-action-item">
                                    <DropboxOutlined className="icon" />
                                    <span className="action-text">Orders</span>
                                </Link>

                                <Divider type="vertical" style={{ height: "20px", borderLeft: "1px solid #d9d9d9", margin: "0", alignSelf: "center" }} className="action-divider" />

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