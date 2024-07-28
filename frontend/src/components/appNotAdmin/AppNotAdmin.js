import { Link } from "react-router-dom"

const AppNotAdmin = () => {
    return (
        <div style={{minHeight : "100dvh"}} className="d-flex flex-column align-items-center justify-content-center text-center col-12">
            <h1 style={{fontSize: 300}}>404</h1>
            <h2>Страница не найдена</h2>
            <Link to={"/main"}>
            <h3 className="text-primary" style={{textDecoration: "underline"}}>На главную</h3>
            </Link>
        </div>
    )
}

export default AppNotAdmin