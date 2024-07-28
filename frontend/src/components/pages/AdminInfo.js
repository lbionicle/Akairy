import AppHeader from "../appHeader/AppHeader";
import AdminNavigation from "../adminNavigation/AdminNavigation";
import PersonalInfo from "../personalInfo/PersonalInfo";
import AppCheckToken from "../appCheckToken/AppCheckToken";
import AppCheckRole from "../appCheckRole/AppCheckRole";


const AdminInfo = ({onLogout}) => {

    return (
        <AppCheckToken>
            <AppCheckRole>
                <AppHeader/>
                <div className="d-flex flex-wrap justify-content-between align-items-start col-11 m-auto">
                    <AdminNavigation onLogout={onLogout}/>
                    <PersonalInfo/>
                </div>
            </AppCheckRole>
        </AppCheckToken>
    )
}

export default AdminInfo;