import AppCheckToken from "../appCheckToken/AppCheckToken";
import AppHeader from "../appHeader/AppHeader";
import UserApplication from "../userApplication/UserApplication";
import UserNavigation from "../userNavigation/UserNavigation";


const UserApp = ({onLogout}) => {

    return (
        <AppCheckToken>
            <AppHeader/>
            <div className="d-flex flex-wrap justify-content-between align-items-start col-11 m-auto">
                <UserNavigation onLogout={onLogout}/>
                <UserApplication/>
            </div>
        </AppCheckToken>
    )
}

export default UserApp;