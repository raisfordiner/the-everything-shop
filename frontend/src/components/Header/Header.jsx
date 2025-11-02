import './Header.css';
import {
    SearchOutlined,
    UserOutlined,
    ShoppingCartOutlined,
    DownOutlined,
    TruckOutlined,
    DropboxOutlined,
} from '@ant-design/icons';
import { Input, Button, Divider, Row, Col, Badge } from 'antd';
import { Link } from 'react-router-dom';

const { Search } = Input;

const Header = () => {
    return (
        <header className="header">
            <div className="header__upper">
                <div className="upper__left">
                    <span>Welcome to my everything-shop!</span>
                </div>
                <div className="upper__right">
                    <span>
                        <DownOutlined className="icon" />
                        Deliver 000000
                    </span>
                    <span>
                        <TruckOutlined className="icon" />
                        Track your order
                    </span>
                    <span>
                        <DropboxOutlined className="icon" />
                        All offers
                    </span>
                </div>
            </div>

            <div className="header__lower">
                <Row align="middle" justify="space-between">
                    <Col flex="200px">
                        <Link to="/" className="brand">
                            E-Commerce
                        </Link>
                    </Col>

                    <Col flex="auto" className="search-col">
                        <Search
                            placeholder="Search for products..."
                            enterButton={<SearchOutlined />}
                            size="large"
                            allowClear
                        />
                    </Col>

                    <Col flex="250px" className="action-col">
                        <div className="actions">
                        <Link to="/login">
                            <Button
                                icon={<UserOutlined />}
                                type="text"
                                className="header-btn"
                            >
                                Sign In / Sign Up
                            </Button>
                        </Link>

                        <Divider type="vertical" />

                        <Link to="/cart">
                            <Badge count={3} size="small">
                            <Button
                                icon={<ShoppingCartOutlined />}
                                type="text"
                                className="header-btn"
                            >
                                Cart
                            </Button>
                            </Badge>
                        </Link>
                        </div>
                    </Col>
                </Row>
            </div>
        </header>
    );
}

export default Header;