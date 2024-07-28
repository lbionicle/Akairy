
import { Link } from "react-router-dom";

import ModalManager from "../modalManager/ModalManager";

import "./mainHeader.scss";
import logo from "../../icons/chatbot-logo.svg";

const MainHeader = ({userRole}) => {

    return (
        <>
            <nav style={{zIndex : 100, backgroundColor : "#fff"}} className="navbar navbar-expand-lg col-12 pt-3 pb-3 position-fixed top-0">
                <div className="wrapper-navbar col-11 m-auto">
                    <div className="d-flex flex-wrap justify-content-between align-items-center col-12">
                        <div>
                            <img src={logo} alt="logo" />
                        </div>
                        <div className="d-lg-none ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation"><i class="bi fa-2x bi-list"></i></div>
                        <div className="collapse navbar-collapse mt-3 mt-lg-0 justify-content-end" id="navbarNav">
                            <ul className="navbar-nav col-12 col-lg-6">
                                <li style={{cursor : "pointer"}} className="col-12 col-lg-3 ms-lg-auto mb-3 mb-lg-0 text-end" data-bs-toggle="modal" data-bs-target="#manager">Контакты менеджеров</li>
                                <li className="col-12 col-lg-3 text-end">
                                    {userRole === "User" ? <Link to={"/user-info"}>Личный кабинет</Link> : <Link to={"/admin-info"}>Личный кабинет</Link>}
                                </li>                        
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
            <ModalManager/>
        </>
    )
}

export default MainHeader;