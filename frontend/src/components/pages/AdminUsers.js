import AdminNavigation from "../adminNavigation/AdminNavigation";
import AdminUser from "../adminUser/AdminUser";
import AppHeader from "../appHeader/AppHeader";
import AppCheckToken from "../appCheckToken/AppCheckToken";
import AppCheckRole from "../appCheckRole/AppCheckRole";

const AdminUsers = ({onLogout}) => {

    return (
        <AppCheckToken>
            <AppCheckRole>
                <AppHeader/>
                <div className="d-flex flex-wrap justify-content-between align-items-start col-11 m-auto">
                    <AdminNavigation onLogout={onLogout}/>
                    <AdminUser/>
                </div>
            </AppCheckRole>
        </AppCheckToken>
    )
}

export default AdminUsers;