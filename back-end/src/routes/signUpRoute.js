import {getDbConnection} from '../db'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {v4 as uuid} from 'uuid'
import { VerficationMail } from '../email/email';

export const signUpRoute = {
    path:'/api/signup',
    method:'post',
    handler: async (req,res)=>{
        const {email,password} = req.body;

        const db = getDbConnection(process.env.DATABASE_NAME)
        const user = await db.collection('users').findOne({email})

        if(user){
            res.sendStatus(409)
        }

        const passwordHash = await bcrypt.hash(password,10);

        const verificationString = uuid()

        const startingInfo = {
            hairColor:'',
            favoriteFood:'',
            bio:''
        }

        const result = await db.collection('users').insertOne({
            email,
            passwordHash,
            info:startingInfo,
            isVerified:false,
            verificationString
        })

        const {insertedId} = result;

        VerficationMail({
            to:email,
            subject:'Please verify your email!',
            html: `<b>Thanks for signup to our website to verify </b><a href="http://localhost:3001/verify-email/${verificationString}">click here</a> `
        })

        jwt.sign({
            id:insertedId,
            email,
            info:startingInfo,
            isVerified:false
        },
        process.env.JWT_SECRET,
        {
            expiresIn:'2d'
        },
        (err,token)=>{
            if(err)
            res.status(500).send(err)

            res.status(200).json({token})
        }
        )
    }
}