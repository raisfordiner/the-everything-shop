import React from 'react'
import {Button, Col, Form, Input, Row} from "antd";
import {MailOutlined, SafetyCertificateOutlined} from "@ant-design/icons";
import "./ChangePassword.scss"

const ChangePassword = () => {
    return (
        <>
            <div className="change-password">
                <h2 className="change-password__title">Change Password</h2>

                <div className="change-password__card">
                    <SafetyCertificateOutlined className="change-password__icon"/>

                    <h2 className="change-password__card-title">Security Verification Required</h2>

                    <p className="change-password__text">
                        For your account’s protection, we need to verify your identity before allowing a password
                        change.
                    </p>

                    <p className="change-password__text change-password__text--mb-large">
                        Please click the button below. We will send a <strong>secure link</strong> to your registered
                        email address to help you reset your password.
                    </p>

                    <Button
                        type="primary"
                        size="large"
                        icon={<MailOutlined/>}
                        className="change-password__btn"
                    >
                        SEND RESET LINK
                    </Button>
                </div>
            </div>
        </>
    )
}

export default ChangePassword;