import { v4 as uuid } from 'uuid';
import {getDbConnection} from '../db'
import {VerficationMail} from '../email/email'

export const forgotPasswordRoute = {
    path:'/api/forgot-password/:emailValue',
    method:'put',
    handler:async (req,res) => {
        const {emailValue:email} = req.params;

        const db = getDbConnection(process.env.DATABASE_NAME)
        const passwordResetCode = uuid()

        const {result} = await db.collection('users').updateOne({email},{$set:{passwordResetCode}})

        if(result.nModified > 0){
            try {
                await VerficationMail({
                    to:email,
                    subject:'Password reset',
                    html:`<p>To reset your password please </p><a href="http://localhost:3001/reset-password/${passwordResetCode}">click here</a>`
                })
            } catch (error) {
                console.log(error)
                res.sendStatus(500)
            }
        }
        res.sendStatus(200)
    }
}