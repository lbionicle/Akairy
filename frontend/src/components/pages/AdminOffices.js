import AdminNavigation from "../adminNavigation/AdminNavigation";
import AppHeader from "../appHeader/AppHeader";
import AdminOffice from "../adminOffice/AdminOffice";
import AppCheckToken from "../appCheckToken/AppCheckToken";
import AppCheckRole from "../appCheckRole/AppCheckRole";

const AdminOffices = ({onLogout}) => {

    return (
        <AppCheckToken>
            <AppCheckRole>
                <AppHeader/>
                <div className="d-flex flex-wrap justify-content-between align-items-start col-11 m-auto">
                    <AdminNavigation onLogout={onLogout}/>
                    <AdminOffice/>
                </div>
            </AppCheckRole>
        </AppCheckToken>
    )
}

export default AdminOffices;