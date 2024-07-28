import { useRef, useState } from "react";
import useServices from "../../services/Services";
import { SuccessAlert, DangerAlert } from "../alerts/Alerts";
import useAlert from "../../hooks/useAlert";

import "./modalAddOffice.scss";

const ModalAddOffice = ({ fetchOffices }) => {
    const [photos, setPhotos] = useState([]);
    const fileInputRef = useRef(null);
    const { alertMessage, alertType, showAlert } = useAlert();
    const { addOffice } = useServices();

    const onSubmitOffice = (e) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.target).entries());
        data.price = +data.price;
        data.area = +data.area;
        data.photos = photos.map(photo => photo.base64);

        addOffice(data).then((json) => {
            fetchOffices();
            e.target.reset();
            setPhotos([]);
            showAlert("Офис добавлен", "success");
        }).catch(err => {
            console.error("Error adding office:", err);
            showAlert("Failed to add office.", "danger");
        });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);

        files.forEach(file => {
            if (file.type.startsWith('image/') && (file.type.endsWith('jpeg') || file.type.endsWith('jpg') || file.type.endsWith('png'))) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPhotos(prevPhotos => [...prevPhotos, { base64: reader.result, name: file.name }]);
                };
                reader.readAsDataURL(file);
            } else {
                showAlert("Можно добавлять только изображения форматов .png, .jpg, .jpeg.", "danger");
                fileInputRef.current.value = "";
            }
        });
    };

    const handleRemovePhoto = (photoToRemove) => {
        setPhotos(photos.filter(photo => photo !== photoToRemove));
        const files = Array.from(fileInputRef.current.files);
        const updatedFiles = new DataTransfer();

        files.forEach(file => {
            if (file.name !== photoToRemove.name) {
                updatedFiles.items.add(file);
            }
        });

        fileInputRef.current.files = updatedFiles.files;
    };

    const blockInvalidChar = e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

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
                                <div className="images d-flex flex-wrap">
                                    {photos.map((photo, index) => (
                                        <div key={index} className="image-wrapper">
                                            <img src={photo.base64} className="d-block сol-4 col-lg-2 me-2 mt-2" alt={photo.name} />
                                            <div className="overlay" onClick={() => handleRemovePhoto(photo)}>
                                                <i className="bi bi-trash3 delete-icon"></i>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <form onSubmit={onSubmitOffice} id="addOffice" className="mt-2">
                                    <div className="modal-body-images">
                                        <label htmlFor="formFileMultiple" className="form-label">Добавить фото <span className="text-danger">*</span></label>
                                        <input
                                            className="form-control"
                                            name="photos"
                                            type="file"
                                            id="formFileMultiple"
                                            accept=".png, .jpg, .jpeg"
                                            multiple
                                            onChange={handleFileChange}
                                            ref={fileInputRef}
                                            required
                                        />
                                    </div>
                                    <div className="modal-body-options my-2">
                                        <label htmlFor="input-name" className="form-label">Название <span className="text-danger">*</span></label>
                                        <input className="form-control" type="text" name="name" id="input-name" required></input>
                                    </div>
                                    <div className="modal-body-address my-2">
                                        <label htmlFor="input-address" className="form-label">Адрес <span className="text-danger">*</span></label>
                                        <input className="form-control" type="text" name="address" id="input-address" required></input>
                                    </div>
                                    <div className="modal-body-options">
                                        <label htmlFor="textarea-options" className="form-label">Параметры объекта <span className="text-danger">*</span></label>
                                        <textarea className="form-control" name="options" id="textarea-options" rows="10" required></textarea>
                                    </div>
                                    <div className="modal-body-description my-2">
                                        <label htmlFor="textarea-description" className="form-label">Описание <span className="text-danger">*</span></label>
                                        <textarea className="form-control" name="description" id="textarea-description" rows="10" required></textarea>
                                    </div>
                                    <div className="modal-body-area">
                                        <label htmlFor="input-area" className="form-label">Площадь<span className="text-danger">*</span></label>
                                        <input onKeyDown={blockInvalidChar} className="form-control" type="number" step="any" name="area" id="input-area" required></input>
                                    </div>
                                    <div className="modal-body-price my-2">
                                        <label htmlFor="input-price" className="form-label">Цена<span className="text-danger">*</span></label>
                                        <input onKeyDown={blockInvalidChar} className="form-control" type="number" step="any" name="price" id="input-price" required></input>
                                    </div>
                                    <div className="modal-body-controls col-12 mt-3">
                                        <button type="submit" className="btn btn-success col-12">Добавить</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ModalAddOffice;
