
import AppHeader from "../appHeader/AppHeader";
import UserNavigation from "../userNavigation/UserNavigation";
import PersonalInfo from "../personalInfo/PersonalInfo";
import AppCheckToken from "../appCheckToken/AppCheckToken";

const UserInfo = ({onLogout}) => {

    return (
        <AppCheckToken>
            <AppHeader/>
            <div className="d-flex flex-wrap justify-content-between align-items-start col-11 m-auto">
                <UserNavigation onLogout={onLogout}/>
                <PersonalInfo/>
            </div>
        </AppCheckToken>
    )
}

export default UserInfo;