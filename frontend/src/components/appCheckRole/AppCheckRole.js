import { useEffect, useState } from "react";
import AppNotAdmin from "../appNotAdmin/AppNotAdmin";
import useServices from "../../services/Services";
import Spinner from "../spinner/Spinner";

const AppCheckRole = (props) => {
    const { getRoleByToken } = useServices();
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRole = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await getRoleByToken(token);
                setRole(response.role);
            } catch (error) {
                console.error("Failed to fetch role:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRole();
    }, [getRoleByToken]);

    if (loading) {
        return <div className="d-flex justify-content-center align-items-center col-12 vh-100"><Spinner/></div>
    }

    return (
        <>
            {role === "Admin" ? (
                <>
                    {props.children}
                </>
            ) : (
                <AppNotAdmin />
            )}
        </>
    );
};

export default AppCheckRole;