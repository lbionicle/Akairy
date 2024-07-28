import useServices from "../../services/Services";
import NavPassword from "../navPassword/NavPassword";
import { SuccessAlert, DangerAlert } from "../alerts/Alerts";
import useAlert from "../../hooks/useAlert";

import "./modalAddUser.scss"

const ModalAddUser = ({fetchUsers}) => {
    const { register } = useServices();
    const { alertMessage, alertType, showAlert } = useAlert();

    const blockInvalidChar = e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

    const onSubmitUser = (e) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.target).entries());
        data.blocked = false;
        data.admin = false;

        register(data)
        .then(() => {
            showAlert("Пользователь добавлен", "success");
            e.target.reset();
            fetchUsers();
            const modalElement = document.getElementById("modalAdd");
            const modal = window.bootstrap.Modal.getInstance(modalElement);
            modal.hide();
        }).catch(err => {
            console.error("Error adding user:", err);
            showAlert("Ошибка при добавлении пользователя", "danger");
        });
    };

    return (
        <>
            {alertMessage && alertType === "success" && <SuccessAlert message={alertMessage} />}
            {alertMessage && alertType === "danger" && <DangerAlert message={alertMessage} />}
            <div className="modal" id="modalAdd" tabIndex="-1" aria-labelledby="modalAddLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div style={{ cursor: "pointer", top: "10px", right: "20px", borderRadius: "0.3rem" }} className="btn btn-outline-dark position-absolute" data-bs-dismiss="modal" aria-label="close">
                                <i className="bi fa-lg bi-x-lg"></i>
                            </div>
                            <div className="modal-body-add col-12">
                                <form className="d-flex flex-wrap justify-content-between" id="addUser" onSubmit={onSubmitUser}>
                                    <div className="input-container col-12 col-md-5 col-xxl-4 p-2">
                                        <label htmlFor="lastName">Фамилия <span className="text-danger">*</span></label>
                                        <input name="lastName" className="form-control col-12" type="text" placeholder="Иванов" required />
                                    </div>
                                    <div className="input-container col-12 col-md-5 col-xxl-4 p-2">
                                        <label htmlFor="firstName">Имя <span className="text-danger">*</span></label>
                                        <input name="firstName" className="form-control col-12" type="text" placeholder="Иван" required />
                                    </div>
                                    <div className="input-container col-12 col-md-5 col-xxl-4 p-2">
                                        <label htmlFor="telephone">Номер <span className="text-danger">*</span></label>
                                        <input
                                            onKeyDown={blockInvalidChar}
                                            name="tel"
                                            className="form-control col-12"
                                            type="tel"
                                            pattern="[3][7][5][0-9]{9}"
                                            placeholder="375123456789"
                                            required
                                        />
                                    </div>
                                    <div className="input-container col-12 col-md-5 col-xxl-4 p-2">
                                        <label htmlFor="age">Возраст <span className="text-danger">*</span></label>
                                        <input onKeyDown={blockInvalidChar} name="age" className="form-control col-12" type="number" placeholder="XX" min={1} max={120} required />
                                    </div>
                                    <div className="input-container col-12 col-md-5 col-xxl-4 p-2">
                                        <label htmlFor="email">Почта <span className="text-danger">*</span></label>
                                        <input name="email" className="form-control col-12" type="email" placeholder="Example@gmail.com" required />
                                    </div>
                                    <div className="input-container col-12 col-md-5 col-xxl-4 p-2">
                                        <label htmlFor="password">Пароль <span className="text-danger">*</span></label>
                                        <NavPassword
                                            name="password"
                                            className="form-control col-12"
                                            type="password"
                                            minLength={8}
                                            maxLength={16}
                                            placeholder="Пароль"
                                            required
                                        />
                                    </div>
                                    <div className="form-controls text-center col-12 mt-4 px-2">
                                        <button className="btn btn-submit btn-success text-center col-12" type="submit">Добавить</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ModalAddUser;
