import { useState } from "react";

import "./navPassword.scss"

const NavPassword = ({ name, placeholder, required, minLength, maxLength, onChange, value }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="password-input-wrapper">
            <input
                name={name}
                className="form-control w-100"
                type={showPassword ? "text" : "password"}
                minLength={minLength}
                maxLength={maxLength}
                placeholder={placeholder}
                onChange={onChange}
                value={value}
                required={required}
            />
            <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
            >
                {!showPassword ? (
                    <i className="bi fa-lg bi-eye-slash"></i>
                ) : (
                    <i className="bi fa-lg bi-eye"></i>
                )}
            </button>
        </div>
    );
};

export default NavPassword;