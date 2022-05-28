import {ObjectID} from 'mongodb'
import jwt from 'jsonwebtoken'
import {getDbConnection} from '../db'


export const verifyEmailRoute = {
    path:'/api/verify-email',
    method:'put',
    handler: async (req,res)=>{
        console.log('in verify email route')
        const {verificationString} = req.body

        const db = getDbConnection(process.env.DATABASE_NAME)

        const result = await db.collection('users').findOne({
            verificationString
        })

        if(!result) return res.status(401).json({message:'The verification string is incorrect'})

        const {_id:id,email,info,} = result

        await db.collection('users').updateOne({_id:ObjectID(id)},{
            $set:{
                isVerified:true
            }
        })

        jwt.sign({id,email,isVerified:true,info},process.env.JWT_SECRET,{expiresIn:'2d'},(err,token)=>{
            if(err) return res.status(500)

            return res.status(200).json({token})
        })

    }
}