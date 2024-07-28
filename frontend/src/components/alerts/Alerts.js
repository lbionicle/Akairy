import React, { useEffect, useState } from 'react';

const Alert = ({message, type}) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => setVisible(false), 3000);
        return () => clearTimeout(timeout);
    }, []);

    if (!visible) return null;

    return (
        <div style={{zIndex: 99999, transition: 'opacity 1s', opacity: visible ? 1 : 0}} className="position-absolute top-0 d-flex justify-content-center align-items-center p-3 w-100">
            <div className={`alert alert-${type} d-flex align-items-center`} role="alert" style={{minWidth: '200px', maxWidth: '80%', width: 'auto'}}>
                <i style={{fontSize: "1.5rem"}} className={`bi bi-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2`}></i>
                <div>
                    {message}
                </div>
            </div>
        </div>
    );
};

const SuccessAlert = ({message}) => <Alert message={message} type="success" />;
const DangerAlert = ({message}) => <Alert message={message} type="danger" />;

export { SuccessAlert, DangerAlert };
