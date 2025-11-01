import CustomerLayout from '../components/layouts/CustomerLayout/CustomerLayout.jsx';
import AdminLayout from '../components/layouts/AdminLayout/AdminLayout.jsx';
import Home from '../pages/customer/Home/Home.jsx';
import DashBoard from '../pages/admin/DashBoard/DashBoard.jsx';
import Login from "../pages/public/Login/Login.jsx";
import Register from "../pages/customer/Register/Register.jsx";
import Profile from "../components/layouts/Profile/Profile.jsx";
import AccountInfo from "../pages/customer/AccountInfo/AccountInfo.jsx";
import Address from "../pages/customer/Address/Address.jsx";
import ChangePassword from "../pages/customer/ChangePassword/ChangePassword.jsx";


export const routes = [
    {
        path: '/',
        element: <CustomerLayout />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/login',
                element: <Login />,
            },
            {
                path: '/register',
                element: <Register />,
            },
            {
                path: '/profile',
                element: <Profile />,
                children: [
                    {
                        index: true,
                        element: <AccountInfo/>
                    },
                    {
                        path: 'my-address',
                        element: <Address />,
                    },
                    {
                        path: 'change-password',
                        element: <ChangePassword />,
                    }
                ]
            }
        ]
    },
    {
        path: '/admin',
        element: <AdminLayout />,
        children: [
            {
                path: "dashboard",
                element: <DashBoard />
            }
        ]
    }
]