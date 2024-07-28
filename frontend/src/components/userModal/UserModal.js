import { useEffect, useState } from "react";
import useServices from "../../services/Services";
import Spinner from "../spinner/Spinner";
import { SuccessAlert, DangerAlert } from "../alerts/Alerts";
import useAlert from "../../hooks/useAlert";

import "./userModal.scss"

const UserModal = ({ officeId }) => {
    const [officeInfo, setOfficeInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const { getOfficeById, addFavoriteOffice, addApplications, _apiBase } = useServices();
    const userToken = localStorage.getItem("token");
    const { alertMessage, alertType, showAlert } = useAlert();

    useEffect(() => {
        if (officeId) {
            setLoading(true);
            getOfficeById(officeId).then(data => {
                setOfficeInfo(data);
                setLoading(false);
            }).catch(err => {
                console.error("Error fetching office:", err);
                setLoading(false);
                showAlert("Error fetching office details.", "danger");
            });
        }
    }, [officeId]);

    const handleSendRequest = () => {
        addApplications(userToken, officeId).then((json) => {
            if (json.detail.includes('Администратор')) {
                showAlert(json.detail, "danger");
            } else {
                showAlert(json.detail, "success");
            }
        }).catch(err => {
            console.error("Error sending request:", err);
            showAlert("Failed to send request.", "danger");
        });
    }

    const handleAddToFavorites = () => {
        addFavoriteOffice(userToken, officeInfo.id).then((data) => {
            if (data.message.includes('Администратор')) {
                showAlert(data.message, "danger");
            } else {
                showAlert(data.message, "success");
            }
        }).catch(err => {
            console.error("Error adding to favorites:", err);
            showAlert("Failed to add to favorites.", "danger");
        });
    };

    return (
        <>
            <div className="modal" id="modalOffice" tabIndex="-1" aria-labelledby="modalOfficeLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div style={{ cursor: "pointer", top: "10px", right: "20px", borderRadius: "0.3rem" }} className="btn btn-outline-dark position-absolute" data-bs-dismiss="modal" aria-label="close">
                                <i className="bi fa-lg bi-x-lg"></i>
                            </div>
                            {loading ? (
                                <div className='text-center py-3'>
                                    <Spinner />
                                </div>
                            ) : (
                                <div className="modal-body-office col-12">
                                    <div id="carouselIndicators" className="carousel carousel-dark slide col-12" data-bs-ride="carousel">
                                        <div className="carousel-inner">
                                            {officeInfo.photos.map((photo, index) => (
                                                <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                                    <img src={`${_apiBase}/${photo}`} className="d-block w-100" alt={`Office ${index + 1}`} />
                                                </div>
                                            ))}
                                        </div>
                                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselIndicators" data-bs-slide="prev">
                                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                        </button>
                                        <button className="carousel-control-next" type="button" data-bs-target="#carouselIndicators" data-bs-slide="next">
                                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                        </button>
                                    </div>
                                    <div className="modal-body-options col-12 pt-2 pb-2">
                                        <h5>Параметры объекта:</h5>
                                        <h6 style={{ whiteSpace: 'pre-wrap' }}>{officeInfo.options}</h6>
                                    </div>
                                    <div className="modal-body-description col-12 pt-2">
                                        <h5>Описание:</h5>
                                        <h6 style={{ whiteSpace: 'pre-wrap' }}>{officeInfo.description}</h6>
                                    </div>
                                    <div className="modal-body-details col-12 pt-2">
                                        <h5>Детали:</h5>
                                        <h6>Площадь: {officeInfo.area} м²</h6>
                                        <h6>Цена: {officeInfo.price} BYN</h6>
                                        <h6>Адрес: {officeInfo.address}</h6>
                                    </div>
                                    <div className="d-flex align-items-strech modal-body-controls pt-3">
                                        <div
                                            style={{ fontWeight: 500 }}
                                            className="btn btn-outline-dark modal-controls-send py-2 me-2"
                                            onClick={handleSendRequest}
                                        >
                                            Отправить заявку
                                        </div>
                                        <div
                                            style={{maxHeight: 42}}
                                            className={`btn btn-outline-dark modal-controls-addoffice d-flex justify-content-center align-items-center py-2`}
                                            onClick={handleAddToFavorites}
                                        >
                                            <i style={{fontSize: "1.2em"}} className="bi fa-lg bi-heart"></i>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {alertMessage && alertType === "success" && <SuccessAlert message={alertMessage} />}
            {alertMessage && alertType === "danger" && <DangerAlert message={alertMessage} />}
        </>
    );
}

export default UserModal;
