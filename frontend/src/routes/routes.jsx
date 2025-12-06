import CustomerLayout from '../components/layouts/CustomerLayout/CustomerLayout.jsx';
import AdminLayout from '../components/layouts/AdminLayout/AdminLayout.jsx';
import Home from '../pages/customer/Home/Home.jsx';
import DashBoard from '../pages/admin/DashBoard/DashBoard.jsx';
import Login from "../pages/public/Login/Login.jsx";
import Register from "../pages/customer/Register/Register.jsx";
import VerifyEmail from "../pages/public/VerifyEmail/VerifyEmail.jsx";
import Profile from "../components/layouts/Profile/Profile.jsx";
import AccountInfo from "../pages/customer/AccountInfo/AccountInfo.jsx";
import Address from "../pages/customer/Address/Address.jsx";
import ChangePassword from "../pages/customer/ChangePassword/ChangePassword.jsx";
import FilteredProducts from "../pages/customer/FilteredProducts/FilteredProducts.jsx";
import CustomerProductDetail from "../components/ProductDetail/ProductDetail.jsx";
import SellerProductDetail from "../pages/seller/ProductDetail/ProductDetail.jsx";
import Confirmation from "../pages/customer/Confirmation/Confirmation.jsx";
import ForgotPassword from "../pages/customer/ForgotPassword/ForgotPassword.jsx";
import Category from '../pages/admin/Category/Category.jsx';
import AddCategory from '../pages/admin/Category/AddCategory.jsx';
import EditCategory from '../pages/admin/Category/EditCategory.jsx';
import Order from '../pages/admin/Order/Order.jsx';
import Customers from "../pages/admin/Customers/Customers.jsx";
import EditCustomer from "../pages/admin/Customers/EditCustomer.jsx";
import AddCustomer from "../pages/admin/Customers/AddCustomer.jsx";
import Coupons from "../pages/admin/Coupons/Coupons.jsx";
import EditCoupon from "../pages/admin/Coupons/EditCoupon.jsx";
import AddCoupon from "../pages/admin/Coupons/AddCoupon.jsx";
import SellerLayout from "../components/layouts/SellerLayout/SellerLayout.jsx";
import SellerProducts from "../pages/seller/Product/Product.jsx";

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
                path: '/auth/verify',
                element: <VerifyEmail />,
            },
            {
                path: '/products/:productId',
                element: <CustomerProductDetail />
            },
            {
                path: '/category/:categoryId',
                element: <FilteredProducts />
            },
            {
                path: '/confirmation',
                element: <Confirmation />,
            },
            {
                path: '/forgot-password',
                element: <ForgotPassword />,
            },
            {
                path: '/profile',
                element: <Profile />,
                children: [
                    {
                        index: true,
                        element: <AccountInfo />
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
            },
            {
                path: "categories",
                element: <Category />
            },
            {
                path: "categories/add-category",
                element: <AddCategory />
            },
            {
                path: "categories/edit-category/:id",
                element: <EditCategory />
            },
            {
                path: "orders",
                element: <Order />,
            },
            {
                path: "customers",
                element: <Customers />
            },
            {
                path: "customers/edit-customer/:id",
                element: <EditCustomer />
            },
            {
                path: "customers/add-customer",
                element: <AddCustomer />
            },
            {
                path: "coupons",
                element: <Coupons />,
            },
            {
                path: "coupons/edit-coupon/:id",
                element: <EditCoupon />
            },
            {
                path: "coupons/add-coupon",
                element: <AddCoupon />
            }
        ]
    },
    {
        path: '/seller',
        element: <SellerLayout />,
        children: [
            {
                path: "products",
                element: <SellerProducts />
            },
            {
                path: "products/new",
                element: <SellerProductDetail />
            },
            {
                path: "products/:id",
                element: <SellerProductDetail />
            }
        ]
    }
]