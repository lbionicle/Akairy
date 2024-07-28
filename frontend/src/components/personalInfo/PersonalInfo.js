import { useEffect, useState } from "react";
import useServices from "../../services/Services";
import Spinner from "../spinner/Spinner";
import NavPassword from "../navPassword/NavPassword";
import { SuccessAlert, DangerAlert } from "../alerts/Alerts";
import useAlert from "../../hooks/useAlert";

const PersonalInfo = () => {
    const [userInfo, setUserInfo] = useState({
        lastName: '',
        firstName: '',
        telephone: '',
        age: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(true);
    const { getUserByToken, updateUserByToken } = useServices();
    const { alertMessage, alertType, showAlert } = useAlert();

    const blockInvalidChar = e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

    const onItemsLoading = () => {
        getUserByToken(localStorage.getItem("token"))
        .then(onItemsLoaded)
        .catch(err => {
            console.error("Error fetching user info:", err);
            showAlert("Failed to load user info.", "danger");
            setLoading(false);
        });
    };

    const onItemsLoaded = (data) => {
        if (!data.detail) {
            setUserInfo(data);
        } else {
            showAlert(data.detail, "danger");
        }
        setLoading(false);
    };

    useEffect(() => {
        onItemsLoading();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({
            ...userInfo,
            [name]: value.trim()
        });
    };

    const onSubmitChange = (e) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.target).entries());
        data.age = +data.age;

        updateUserByToken(localStorage.getItem("token"), data)
        .then(response => {
            showAlert("Данные обновлены", "success");
        })
        .catch(err => {
            console.error("Error updating user info:", err);
            showAlert("Failed to update user info.", "danger");
        });
    }

    return (
        <>
            {alertMessage && alertType === "success" && <SuccessAlert message={alertMessage} />}
            {alertMessage && alertType === "danger" && <DangerAlert message={alertMessage} />}
            {
                loading ? 
                <Spinner />
                :
                <div className="personal-wrapper wrapper col-12 col-md-7 col-xxl-8 my-4 my-sm-1 my-lg-3 my-xl-4">
                    <form onSubmit={onSubmitChange} className="d-flex flex-wrap justify-content-between" id="personalInfo">
                        <div className="input-container col-12 col-md-5 col-xxl-4 p-2">
                            <label htmlFor="lastName">Фамилия <span className="text-danger">*</span></label>
                            <input onChange={handleChange} name="lastName" className="form-control col-12" type="text" placeholder="Иванов" value={userInfo?.lastName} required/>
                        </div>
                        <div className="input-container col-12 col-md-5 col-xxl-4 p-2">
                            <label htmlFor="firstName">Имя <span className="text-danger">*</span></label>
                            <input onChange={handleChange} name="firstName" className="form-control col-12" type="text" placeholder="Иван" value={userInfo?.firstName} required/>
                        </div>
                        <div className="input-container col-12 col-md-5 col-xxl-4 p-2">
                            <label htmlFor="telephone">Номер <span className="text-danger">*</span></label>
                            <input
                                onChange={handleChange}
                                onKeyDown={blockInvalidChar}
                                name="tel"
                                className="form-control col-12"
                                type="tel"
                                pattern="[3][7][5][0-9]{9}"
                                placeholder="375123456789"
                                value={userInfo?.tel}
                                required
                                />
                        </div>
                        <div className="input-container col-12 col-md-5 col-xxl-4 p-2">
                            <label htmlFor="age">Возраст <span className="text-danger">*</span></label>
                            <input onKeyDown={blockInvalidChar} onChange={handleChange} name="age" className="form-control col-12" type="number" placeholder="XX" minLength={1} maxLength={3} value={userInfo?.age} required/>
                        </div>
                        <div className="input-container col-12 col-md-5 col-xxl-4 p-2">
                            <label htmlFor="email">Почта <span className="text-danger">*</span></label>
                            <input onChange={handleChange} name="email" className="form-control col-12" type="email" placeholder="Example@gmail.com" value={userInfo?.email} required/>
                        </div>
                        <div className="input-container col-12 col-md-5 col-xxl-4 p-2">
                            <label htmlFor="password">Пароль <span className="text-danger">*</span></label>
                            <NavPassword
                                name="password"
                                placeholder="Пароль"
                                minLength={8}
                                maxLength={16}
                                value={userInfo?.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-controls text-center col-12 col-md-5 col-xxl-4 mt-4 px-2">
                            <button className="btn btn-submit btn-success text-center col-12" type="submit">Сохранить</button>
                        </div>
                    </form>
                </div>
            }
        </>
    )
}

export default PersonalInfo;
