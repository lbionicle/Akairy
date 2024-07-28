import AppChat from "../appChat/AppChat";
import MainHeader from "../mainHeader/MainHeader";
import AppCheckToken from "../appCheckToken/AppCheckToken";
import { useEffect, useState } from "react";
import useServices from "../../services/Services";

const MainPage = () => {

    const [role, setRole] = useState("");

    const {getRoleByToken} = useServices();

    useEffect(() => {
        const fetchRole = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await getRoleByToken(token);
                setRole(response.role);
            } catch (error) {
                console.error("Failed to fetch role:", error);
            }
        }

        fetchRole();
    }, [getRoleByToken])

    return (
        <AppCheckToken>
            <MainHeader userRole={role}/>
            <AppChat userRole={role}/>
        </AppCheckToken>
    )
}

export default MainPage;