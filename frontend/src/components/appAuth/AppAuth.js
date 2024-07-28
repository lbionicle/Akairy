import { useState } from "react";
import useServices from "../../services/Services";
import { useNavigate } from "react-router-dom";

import AuthHeader from "../authHeader/AuthHeader";
import AppLogin from "../appLogin/AppLogin";
import AppRegister from "../appRegister/AppRegister";
import { SuccessAlert, DangerAlert } from "../alerts/Alerts";
import useAlert from "../../hooks/useAlert";

import "./appAuth.scss"

const AppAuth = () => {
    const [stage, setStage] = useState("login");
    const { login, register } = useServices();
    const navigate = useNavigate();
    const { alertMessage, alertType, showAlert } = useAlert();

    const regUser = (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target).entries());
        data.age = +data.age;
        register(data)
        .then(json => {
            if (!json.detail) {
                localStorage.setItem("token", json.token);
                showAlert("Registration successful!", "success");
                navigate("/main");
            } else {
                showAlert(json.detail, "danger");
            }
        })
        .catch(err => {
            console.error("Error during registration:", err);
            showAlert("Registration failed. Please try again.", "danger");
        });
    };

    const loginUser = (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target).entries());
        login(data)
        .then(json => {
            if (!json.detail) {
                localStorage.setItem("token", json.token);
                showAlert("Login successful!", "success");
                navigate("/main");
            } else {
                showAlert(json.detail, "danger");
            }
        })
        .catch(err => {
            console.error("Error during login:", err);
            showAlert("Login failed. Please try again.", "danger");
        });
    };

    return (
        <div className="auth-wrapper">
            {alertMessage && alertType === "success" && <SuccessAlert message={alertMessage} />}
            {alertMessage && alertType === "danger" && <DangerAlert message={alertMessage} />}
            <div className="auth-container col-11 col-lg-4 rounded-2">
                <AuthHeader stage={stage} setStage={setStage}/>
                {stage === "login" ? <AppLogin loginUser={loginUser} /> : <AppRegister regUser={regUser} />}
            </div>
        </div>
    );
}

export default AppAuth;
