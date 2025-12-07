import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ allowedRoles, children }) => {
    // Note: Adjust the selector based on your redux state shape.
    // Based on previous files, it is state.authReducer.user
    const { isAuthenticated, user } = useSelector((state) => state.authReducer);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/access-restricted" replace />;
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;
