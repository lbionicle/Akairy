import { useEffect, useRef, useState } from "react";
import useServices from "../../services/Services";
import Spinner from "../spinner/Spinner";
import { SuccessAlert, DangerAlert } from "../alerts/Alerts";
import useAlert from "../../hooks/useAlert";

import "./adminModal.scss";

const AdminModal = ({ officeId, fetchOffices, setOfficeId }) => {
    const [loading, setLoading] = useState(true);
    const [updatedOffice, setUpdatedOffice] = useState(null);
    const [photos, setPhotos] = useState([]);
    const fileInputRef = useRef(null);
    const { alertMessage, alertType, showAlert } = useAlert();

    const { getOfficeById, updateOfficeById, _apiBase } = useServices();

    useEffect(() => {
        if (officeId) {
            getOfficeById(officeId).then(data => {
                setUpdatedOffice(data);
                setPhotos(data.photos);
                setLoading(false);
            }).catch(err => {
                console.error("Error fetching office:", err);
                setLoading(false);
            });
        }
    }, [officeId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedOffice(prevState => ({
            ...prevState,
            [name]: value
        }));
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

    const convertImageToBase64 = async (imageUrl) => {
        try {
            const response = await fetch(imageUrl, { mode: 'cors' }, {headers: new Headers({'Content-Type': 'application/json', 'x-admin-token': localStorage.getItem("token")})});
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error('Failed to fetch image:', error);
            throw error;
        }
    };

    const convertPhotosToBase64 = async (photos) => {
        const base64Photos = await Promise.all(photos.map(async (photo) => {
            if (typeof photo === 'string') {
                return await convertImageToBase64(`${_apiBase}/${photo}`);
            } else {
                return photo.base64;
            }
        }));
        return base64Photos;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await convertPhotosToBase64(photos)
        .then((data) => {
            const updatedData = { ...updatedOffice, photos: data };

            updateOfficeById(updatedData.id, updatedData)
            .then((json) => {
                fetchOffices();
                setUpdatedOffice(null);
                e.target.reset();
                setOfficeId(null);
                setPhotos([]);
                if (json.message) {
                    showAlert(json.message, "success");
                } else {
                    showAlert(json.detail, "danger");
                }
            }).catch(err => {
                console.error("Error updating office:", err);
                showAlert("Failed to update office.", "danger");
            });
        });
    };

    const blockInvalidChar = e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

    return (
        <>
            {alertMessage && alertType === "success" && <SuccessAlert message={alertMessage} />}
            {alertMessage && alertType === "danger" && <DangerAlert message={alertMessage} />}
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
                                    <p>Удалить фото</p>
                                    <div className="images d-flex flex-wrap">
                                        {photos.map((photo, index) => (
                                            <div key={index} className="image-wrapper">
                                                <img
                                                    src={typeof(photo) === "string" ? `${_apiBase}/${photo}` : photo.base64}
                                                    className="d-block col-2 me-2 mt-2"
                                                    alt={index}
                                                />
                                                <div className="overlay" onClick={() => handleRemovePhoto(photo)}>
                                                    <i className="bi bi-trash3 delete-icon"></i>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <form id="updateModal" onSubmit={handleSubmit} className="mt-2">
                                        <div className="modal-body-images">
                                            <label htmlFor="formFileMultiple" className="form-label">Добавить фото</label>
                                            <input
                                                className="form-control"
                                                name="photos"
                                                type="file"
                                                id="formFileMultiple"
                                                accept=".png, .jpg, .jpeg"
                                                multiple
                                                onChange={handleFileChange}
                                                ref={fileInputRef} 
                                            />
                                        </div>
                                        <div className="modal-body-options my-2">
                                            <label htmlFor="input-name" className="form-label">Название <span className="text-danger">*</span></label>
                                            <input className="form-control" type="text" name="name" id="input-name" value={updatedOffice?.name || ''} onChange={handleChange} required />
                                        </div>
                                        <div className="modal-body-address my-2">
                                            <label htmlFor="input-address" className="form-label">Адрес <span className="text-danger">*</span></label>
                                            <input className="form-control" type="text" name="address" id="input-address" value={updatedOffice?.address || ''} onChange={handleChange} required />
                                        </div>
                                        <div className="modal-body-options">
                                            <label htmlFor="textarea-options" className="form-label">Параметры объекта <span className="text-danger">*</span></label>
                                            <textarea style={{ whiteSpace: 'pre-wrap' }} className="form-control" name="options" id="textarea-options" rows="10" value={updatedOffice?.options || ''} onChange={handleChange} required></textarea>
                                        </div>
                                        <div className="modal-body-description my-2">
                                            <label htmlFor="textarea-description" className="form-label">Описание <span className="text-danger">*</span></label>
                                            <textarea style={{ whiteSpace: 'pre-wrap' }} className="form-control" name="description" id="textarea-description" rows="10" value={updatedOffice?.description || ''} onChange={handleChange} required></textarea>
                                        </div>
                                        <div className="modal-body-area">
                                            <label htmlFor="input-area" className="form-label">Площадь<span className="text-danger">*</span></label>
                                            <input onKeyDown={blockInvalidChar} className="form-control" type="number" step="any" name="area" id="input-area" value={updatedOffice?.area || ''} onChange={handleChange} required />
                                        </div>
                                        <div className="modal-body-price my-2">
                                            <label htmlFor="input-price" className="form-label">Цена<span className="text-danger">*</span></label>
                                            <input onKeyDown={blockInvalidChar} className="form-control" type="number" step="any" name="price" id="input-price" value={updatedOffice?.price || ''} onChange={handleChange} required />
                                        </div>
                                        <div className="modal-body-controls col-12 mt-3">
                                            <button type="submit" className="btn btn-success col-12">Сохранить изменения</button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminModal;
