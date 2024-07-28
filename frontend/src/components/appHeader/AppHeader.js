import { Link } from "react-router-dom";

import logo from "../../icons/chatbot-logo.svg"

import "./appHeader.scss"


const AppHeader = () => {

    return (
        <div className="header col-11 m-auto py-4">
            <Link to={"/main"}>
                <img src={logo} alt="logo" />
            </Link>
        </div>
    )
}

export default AppHeader;