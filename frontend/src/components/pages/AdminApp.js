import AdminNavigation from "../adminNavigation/AdminNavigation";
import AppHeader from "../appHeader/AppHeader";
import AdminApplication from "../adminApplication/AdminApplication";
import AppCheckToken from "../appCheckToken/AppCheckToken";
import AppCheckRole from "../appCheckRole/AppCheckRole";

const AdminApp = ({onLogout}) => {

    return (
        <AppCheckToken>
            <AppCheckRole>
                <AppHeader/>
                <div className="d-flex flex-wrap justify-content-between align-items-start col-11 m-auto">
                    <AdminNavigation onLogout={onLogout}/>
                    <AdminApplication />
                </div>
            </AppCheckRole>
        </AppCheckToken>
    )
}

export default AdminApp;