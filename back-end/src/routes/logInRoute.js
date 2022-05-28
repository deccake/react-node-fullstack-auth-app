import { getDbConnection } from "../db";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const logInRoute = {
    path:'/api/login',
    method:'post',
    handler: async (req,res)=>{
        const {email,password} = req.body;

        const db = getDbConnection(process.env.DATABASE_NAME)

        const user = await db.collection('users').findOne({email})

        if(!user){
            res.sendStatus(401)
        }

        const {_id:id,isVerified,passwordHash, salt info} = user;
        const pepper = process.env.PEPPER_STRING

        const isMatch = await bcrypt.compare(salt+password+pepper,passwordHash)
        if(isMatch){
            jwt.sign({id,email,isVerified,info},process.env.JWT_SECRET,{expiresIn:'2d'},(err,token)=>{
                if(err)
                res.status(500).json({err})

                res.status(200).json({token})
            })
        }else{
            res.sendStatus(401)
        } 

    }
}
