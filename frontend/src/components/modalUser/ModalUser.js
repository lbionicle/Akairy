import React, { useState, useEffect } from 'react';
import useServices from '../../services/Services';
import Spinner from '../spinner/Spinner';
import { SuccessAlert, DangerAlert } from "../alerts/Alerts";
import useAlert from "../../hooks/useAlert";

import "./modalUser.scss";
import NavPassword from '../navPassword/NavPassword';

const ModalUser = ({ userId, fetchUsers }) => {
    const { getUserById, updateUserById } = useServices();
    const [user, setUser] = useState({
        lastName: '',
        firstName: '',
        telephone: '',
        age: '',
        email: '',
        password: '',
        blocked: false,
    });
    const [loading, setLoading] = useState(true);
    const { alertMessage, alertType, showAlert } = useAlert();

    useEffect(() => {
        if (userId) {
            setLoading(true);
            getUserById(userId).then(data => {
                setUser(data);
                setLoading(false);
            }).catch(err => {
                console.error("Error fetching user:", err);
                setLoading(false);
                showAlert("Error fetching user.", "danger");
            });
        }
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        updateUserById(userId, user).then(() => {
            showAlert("Информация о пользователе сохранена", "success");
            fetchUsers();
        }).catch(err => {
            console.error("Error updating user:", err);
            showAlert("Error updating user.", "danger");
        });
    };

    const handleBlockedToggle = (blocked) => {
        setUser(prevState => ({
            ...prevState,
            blocked: blocked,
        }));
    };

    const blockInvalidChar = e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

    return (
        <>
            {alertMessage && alertType === "success" && <SuccessAlert message={alertMessage} />}
            {alertMessage && alertType === "danger" && <DangerAlert message={alertMessage} />}
            <div className="modal" id="modalUser" tabIndex="-1" aria-labelledby="modalUserLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div style={{ cursor: "pointer", top: "10px", right: "20px", borderRadius: "0.5rem" }} className="btn btn-outline-dark position-absolute" data-bs-dismiss="modal" aria-label="close">
                                <i className="bi fa-lg bi-x-lg"></i>
                            </div>
                            {loading ? (
                                <div className="text-center mt-4">
                                    <Spinner />
                                </div>
                            ) : (
                                <form className="d-flex flex-wrap justify-content-between" id="personalInfo" onSubmit={handleSave}>
                                    <div className="input-container col-12 col-md-5 col-xxl-4 p-2">
                                        <label htmlFor="lastName">Фамилия <span className="text-danger">*</span></label>
                                        <input name="lastName" className="form-control col-12" type="text" value={user.lastName} onChange={handleChange} required />
                                    </div>
                                    <div className="input-container col-12 col-md-5 col-xxl-4 p-2">
                                        <label htmlFor="firstName">Имя <span className="text-danger">*</span></label>
                                        <input name="firstName" className="form-control col-12" type="text" value={user.firstName} onChange={handleChange} required />
                                    </div>
                                    <div className="input-container col-12 col-md-5 col-xxl-4 p-2">
                                        <label htmlFor="tel">Номер <span className="text-danger">*</span></label>
                                        <input onKeyDown={blockInvalidChar} name="tel" className="form-control col-12" type="tel" pattern="[3][7][5][0-9]{9}" value={user.tel} onChange={handleChange} required />
                                    </div>
                                    <div className="input-container col-12 col-md-5 col-xxl-4 p-2">
                                        <label htmlFor="age">Возраст <span className="text-danger">*</span></label>
                                        <input onKeyDown={blockInvalidChar} name="age" className="form-control col-12" type="number" value={user.age} onChange={handleChange} min={1} max={120} required />
                                    </div>
                                    <div className="input-container col-12 col-md-5 col-xxl-4 p-2">
                                        <label htmlFor="email">Почта <span className="text-danger">*</span></label>
                                        <input name="email" className="form-control col-12" type="email" value={user.email} onChange={handleChange} required />
                                    </div>
                                    <div className="input-container col-12 col-md-5 col-xxl-4 p-2">
                                        <label htmlFor="password">Пароль <span className="text-danger">*</span></label>
                                        <NavPassword
                                            name="password"
                                            className="form-control col-12"
                                            type="password"
                                            value={user.password}
                                            onChange={handleChange}
                                            minLength={8}
                                            maxLength={16}
                                            required
                                        />
                                    </div>
                                    <div className="btn-group input-container col-12 p-2 text-center" role="group">
                                        <button type="button" className={`btn ${!user.blocked ? 'btn-outline-success active' : 'btn-outline-success'}`} onClick={() => handleBlockedToggle(false)}>Разблокирован</button>
                                        <button type="button" className={`btn ${user.blocked ? 'btn-outline-danger active' : 'btn-outline-danger'}`} onClick={() => handleBlockedToggle(true)}>Заблокирован</button>
                                    </div>
                                    <div className="form-controls text-center col-12 mt-4 px-2">
                                        <button className="btn btn-submit btn-success text-center col-12" type="submit">Сохранить</button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ModalUser;
