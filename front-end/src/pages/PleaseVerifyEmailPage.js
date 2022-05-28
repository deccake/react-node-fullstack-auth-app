import { useEffect } from "react"
import { useHistory } from "react-router-dom"

export const PleaseVerifyEmailPage = ()=>{
    const history = useHistory()

    useEffect(()=>{
        setTimeout(()=>{
            history.push('/')
        },3000)
    },[history])

    return(
        <div className="content-container">
            <h1>Thanks for signup</h1>
            <p>A verification email is sent to your email address please verify before you make any changes</p>
        </div>
    )
}