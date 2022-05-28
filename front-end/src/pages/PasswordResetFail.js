import { useHistory } from "react-router-dom"

export const PasswordResetFail = ()=>{
    const history = useHistory()
    return(
        <>
        <div className="content-container">
            <h1>Uh oo!</h1>
            <p>Something went wrong while trying to reset password</p>
            <button onClick={()=> history.push('/login')}>Back to login</button>
        </div>
        </>
    )
}