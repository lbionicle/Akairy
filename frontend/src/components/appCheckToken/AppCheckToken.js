import AppNotFound from "../appNotFound/AppNotFound"

const AppCheckToken = (props) => {

    return (
        <>
            {
            (localStorage.getItem("token")) ?
            <>
                {props.children}
            </>  
            : 
            <AppNotFound/>
            }

        </>
    )
}

export default AppCheckToken;