
import AppHeader from "../appHeader/AppHeader";
import UserNavigation from "../userNavigation/UserNavigation";
import UserOffices from "../userOffices/UserOffices";
import AppCheckToken from "../appCheckToken/AppCheckToken";

const UserLike = ({onLogout}) => {

    return (
        <AppCheckToken>
            <AppHeader/>
            <div className="d-flex flex-wrap justify-content-between align-items-start col-11 m-auto">
                <UserNavigation onLogout={onLogout}/>
                <UserOffices/>
            </div>
        </AppCheckToken>
    )
}

export default UserLike;