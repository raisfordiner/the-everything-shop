import './Header.css'
import { SearchOutlined, UserOutlined, ShoppingCartOutlined, DownOutlined, TruckOutlined, DropboxOutlined } from '@ant-design/icons'
import { Input, Flex, Button, Divider, Grid, Row, Col } from 'antd'
import { Link } from 'react-router-dom'
const { Search } = Input;

const Header = () => {
    return (
        <div className='header'>
            <div className="header__upper">
                <div className="upper__left">
                    <span>Welcome to my everything-shop!</span>
                </div>
                <div className='upper__right'>
                    <span>
                        <DownOutlined className='icon' />
                        Deliver 000000
                    </span>
                    <span>
                        <TruckOutlined className='icon'/>
                        Track your order
                    </span>
                    <span>
                        <DropboxOutlined className='icon'/>
                        All offers
                    </span>
                </div>
            </div>
            <Row className="header__lower">
                <Col span={6}>
                    <p>E-Commerce</p>   
                </Col>
                <Col span={12}>
                    <Search placeholder="input search text" enterButton />
                </Col>
                <Col span={6}>
                    <div className="last-col">
                        <Link>
                            <Button icon={<UserOutlined className='icon'/>} type='link' variant='link' style={{ color: 'black' }}>
                                Sign Up/Sign In
                            </Button>
                        </Link>
                        <Divider type='vertical' size='large' style={{borderColor: 'black'}}/>
                        <Link>
                            <Button icon={<ShoppingCartOutlined className='icon'/>} type='link' variant='link' style={{ color: 'black' }}>Cart</Button>
                        </Link>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default Header;