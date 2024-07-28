
const useServices = () => {
    const _apiBase = "http://31.129.98.140:1480";

    const getResources = async (url) => {
        let res = await fetch(url, {headers: new Headers({'Content-Type': 'application/json', 'x-admin-token': localStorage.getItem("token")})});

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    };

    const sendData = async (url, data, method) => {
        const res = await fetch(url, {
            method: method,
            body: method !== 'DELETE' ? JSON.stringify(data) : null,
            mode: 'cors',
            headers: new Headers({
                'Content-Type': 'application/json',
                'x-admin-token': localStorage.getItem("token")
            }),
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        return method !== 'DELETE' ? await res.json() : { message: 'Удалено' };
    };

    const register = (json) => sendData(`${_apiBase}/reg`, json, "POST");

    const login = (json) => sendData(`${_apiBase}/login`, json, "POST");

    const addOfficeToFavorite = async (token, id) => await getResources(`${_apiBase}/user/${token}/favorite/${id}`);

    const addOffice = async (json) => await sendData(`${_apiBase}/office`, json, "POST");

    const addFavoriteOffice = (token, officeId) => sendData(`${_apiBase}/user/${token}/favorite/${officeId}`, {}, 'POST');

    const addApplications = (token, officeId) => sendData(`${_apiBase}/applications/${token}/${officeId}`, {}, 'POST');

    const getOffices = () => getResources(`${_apiBase}/office`);

    const getOfficeById = (id) => getResources(`${_apiBase}/office/${id}`);

    const getApplications = () => getResources(`${_apiBase}/applications`);

    const getApplicationsByToken = (token) => getResources(`${_apiBase}/user/${token}/applications`);

    const getUserByToken = (token) => getResources(`${_apiBase}/users/${token}`);

    const getFavoriteOffices = (token) => getResources(`${_apiBase}/user/${token}/favorite`);

    const getUsers = () => getResources(`${_apiBase}/users`);

    const getUserById = (id) => getResources(`${_apiBase}/users/id/${id}`);

    const getOfficeByOptions = (json) => sendData(`${_apiBase}/office/search`, json, 'POST');

    const getRoleByToken = (token) => getResources(`${_apiBase}/user/role/${token}`);

    const searchUsersByPhone = (phone) => getResources(`${_apiBase}/users/search/${phone}`);

    const searchOffices = (query) => getResources(`${_apiBase}/offices/search/${query}`);

    const updateOfficeById = async(id, json) => await sendData(`${_apiBase}/office/${id}`, json, "PUT")

    const updateUserByToken = (token, json) => sendData(`${_apiBase}/users/${token}`, json, "PUT")

    const updateApplication = (appId, statusId) => sendData(`${_apiBase}/applications/${appId}/${statusId}`, {}, "PUT")

    const updateUserById = (id, json) => sendData(`${_apiBase}/users/id/${id}`, json, "PUT")

    const deleteOfficeById = (id) => sendData(`${_apiBase}/office/${id}`, null, "DELETE")

    const deleteFavoriteOffice = (token, officeId) => sendData(`${_apiBase}/user/${token}/favorite/${officeId}`, null, "DELETE")

    const deleteUserByToken = (token) => sendData(`${_apiBase}/users/${token}`, null, "DELETE")

    const deleteUserById = (id) => sendData(`${_apiBase}/users/id/${id}`, null, "DELETE")

    const deleteApplicationById = (app_id) => sendData(`${_apiBase}/applications/${app_id}`, null, "DELETE")

    const downloadReport = async () => {
        const response = await fetch(`${_apiBase}/export/report/pdf`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/pdf',
                'x-admin-token': localStorage.getItem("token")
            }
        });

        if (!response.ok) {
            throw new Error('Could not fetch report');
        }

        const blob = await response.blob();
        return blob;
    };

    return {
        login,
        register,
        getUserByToken,
        updateUserByToken,
        deleteUserByToken,
        addOffice,
        getOffices,
        deleteOfficeById,
        updateOfficeById,
        getOfficeById,
        addOfficeToFavorite,
        getFavoriteOffices,
        addFavoriteOffice,
        getApplications,
        addApplications,
        updateApplication,
        getUsers,
        getUserById,
        updateUserById,
        deleteUserById,
        getOfficeByOptions,
        getRoleByToken,
        getApplicationsByToken,
        deleteApplicationById,
        deleteFavoriteOffice,
        searchUsersByPhone,
        searchOffices,
        downloadReport,
        _apiBase
    };
};

export default useServices;