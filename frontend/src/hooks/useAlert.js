import { useState, useEffect } from "react";

const useAlert = () => {
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertType, setAlertType] = useState(null);

    const showAlert = (message, type) => {
        setAlertMessage(message);
        setAlertType(type);

        setTimeout(() => {
            setAlertMessage(null);
            setAlertType(null);
        }, 3000);
    };

    return { alertMessage, alertType, showAlert };
};

export default useAlert;
