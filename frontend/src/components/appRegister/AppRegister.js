
import NavPassword from "../navPassword/NavPassword";

import "./appRegister.scss";

const AppRegister = ({regUser}) => {

    const blockInvalidChar = e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

    const handleChange = (e) => {
        e.target.value = +e.target.value.replace(/[-e]/gi, '').replace(/^0+/, '');

    };

    return (
        <form onSubmit={regUser} id="reg-user" action="" method="post">
            <label htmlFor="lastName">Фамилия <span className="text-danger">*</span></label>
            <input name="lastName" className="form-control" type="text" placeholder="Иванов" required />
            <label htmlFor="firstName">Имя <span className="text-danger">*</span></label>
            <input name="firstName" className="form-control" type="text" placeholder="Иван" required />
            <label htmlFor="telephone">Номер <span className="text-danger">*</span></label>
            <input
                onKeyDown={blockInvalidChar}
                name="tel"
                className="form-control"
                type="tel"
                pattern="[3][7][5][0-9]{9}"
                placeholder="375123456789"
                required
            />
            <label htmlFor="age">Возраст <span className="text-danger">*</span></label>
            <input onKeyDown={blockInvalidChar} onChange={handleChange} name="age" className="form-control" type="number" placeholder="XX" minLength={1} maxLength={3} required />
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
                <button className="btn btn-submit btn-success col-9 col-xxl-5 text-center" type="submit">Зарегистрироваться</button>
            </div>
        </form>
    )
}

export default AppRegister;