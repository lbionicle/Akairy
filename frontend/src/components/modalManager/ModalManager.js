
import "./modalManager.scss"

const ModalManager = () => {

    return (
        <div class="modal fade" id="manager" tabindex="-1" aria-labelledby="managerLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div style={{padding : "40px 20px 30px 20px"}} class="modal-body d-flex flex-column">
                        <div style={{cursor: "pointer", top: "15px", right: "15px", border : "none"}} className="btn btn-outline-dark position-absolute" data-bs-dismiss="modal" aria-label="close"><i className="bi fa-lg bi-x-lg"></i></div>
                        <h5 class="modal-title text-dark mb-1">Контакты менеджеров:</h5>
                        <a className="mb-1" href="tel: +375292417582">+375-29-24-17-582</a>
                        <a className="mb-1" href="tel: +375292417586">+375-29-24-17-586</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalManager;