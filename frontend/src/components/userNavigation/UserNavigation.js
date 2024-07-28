import { NavLink } from "react-router-dom";

import "./userNavigation.scss"

const UserNavigation = ({onLogout}) => {

    return (
        <ul className="list-group list-group-flush col-12 col-md-4 col-xxl-3 my-1 my-lg-3 my-xl-4">
            <NavLink to={"/user-info"}>
            {({ isActive }) => (
                <li className={isActive ? "list-group-item list-active" : "list-group-item"}><i className="bi fa-lg bi-person me-1"></i>Персональная информация</li>
            )}
            </NavLink>
            <NavLink to={"/user-like"}>
            {({ isActive }) => (
                <li className={isActive ? "list-group-item list-active" : "list-group-item"}><i className="bi fa-lg bi-heart me-1"></i>Понравившиеся офисы</li>
            )}  
            </NavLink>
            <NavLink to={"/user-app"}>
            {({ isActive }) => (
                <li className={isActive ? "list-group-item list-active" : "list-group-item"}><i className="bi fa-lg bi-card-text me-1"></i>Заявки</li>
            )}
            </NavLink>
            <NavLink to={"/"}>
                <li onClick={onLogout} style={{border : "none"}} className="list-group-item text-danger"><i className="bi fa-lg bi-box-arrow-right me-1"></i>Выйти</li>
            </NavLink>
        </ul>
    )
}

export default UserNavigation;