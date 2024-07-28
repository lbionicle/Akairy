
import "./authHeader.scss"

const AuthHeader = ({stage, setStage}) => {

    return (
        <div className="switch-page d-flex flex-wrap justify-content-center text-center mb-3 mb-lg-4">
            <div
                style={{ cursor: "pointer" }}    
                className={`fs-5 ${stage === "login" ? "text-success" : ""}`}
                onClick={() => setStage("login")}    
            >Логин</div>
            <div className="mx-2 fs-5">/</div>
            <div
                style={{ cursor: "pointer" }}
                className={`fs-5 ${stage === "register" ? "text-success" : ""}`}
                onClick={() => setStage("register")}    
            >Регистрация</div>
        </div>
    )
}

export default AuthHeader;