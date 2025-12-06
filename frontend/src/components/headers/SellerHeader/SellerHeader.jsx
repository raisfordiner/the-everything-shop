import './SellerHeader.css'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { Row, Col, message, Dropdown } from 'antd'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import authService from "../../../services/authService.js";
import { setLogout } from "../../../redux/actions/authAction.js";

const SellerHeader = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [messageApi, contextHolder] = message.useMessage();

    const { isAuthenticated, user } = useSelector((state) => state.authReducer);

    const handleLogout = async () => {
        try {
            await authService.logout();
            dispatch(setLogout());
            messageApi.open({
                type: 'success',
                content: 'Log out successfully!',
            });
            navigate('/login');
        }
        catch (error) {
            console.error(error);
            messageApi.open({
                type: 'error',
                content: 'Log out failed',
            });
        }
    }

    const userMenu = {
        items: [
            {
                key: 'profile',
                icon: <UserOutlined />,
                label: <Link to="/seller/profile">Profile</Link>
            },
            {
                key: 'logout',
                icon: <LogoutOutlined />,
                label: 'Logout',
                onClick: handleLogout
            }
        ]
    };

    return (
        <div className='seller-header'>
            {contextHolder}
            <Row className="seller-header__main">
                <Col span={12}>
                    <Link to="/seller" className="logo">
                        SELLER PORTAL
                    </Link>
                </Col>
                <Col span={12}>
                    <div className="main__right">
                        {isAuthenticated ? (
                            <Dropdown menu={userMenu} placement="bottomLeft" arrow>
                                <a onClick={(e) => e.preventDefault()} className="user-menu-trigger">
                                    <UserOutlined className="icon" />
                                    {user?.username || 'Seller'}
                                </a>
                            </Dropdown>
                        ) : (
                            <Link to="/login" className="header-action-item">
                                <UserOutlined className="icon" />
                                <span>Sign In</span>
                            </Link>
                        )}
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default SellerHeader;
