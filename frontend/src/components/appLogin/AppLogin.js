
import NavPassword from "../navPassword/NavPassword"

import "./appLogin.scss"

const AppLogin = ({loginUser}) => {

    return (
        <form onSubmit={loginUser} id="login-user" action="" method="post">
            <label htmlFor="email">Почта <span className="text-danger">*</span></label>
            <input name="email" className="form-control" type="email" placeholder="Example@gmail.com" required />
            <label htmlFor="password">Пароль <span className="text-danger">*</span></label>
            <NavPassword
                name="password"
                placeholder="Пароль"
                minLength={8}
                maxLength={16}
                required
            />
            <div className="form-controls w-100 text-center mt-4">
                <button className="btn btn-submit btn-success col-8 col-xxl-5 text-center" type="submit">Войти</button>
            </div>
        </form>
    )
}

export default AppLogin;