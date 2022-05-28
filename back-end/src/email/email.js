import nodemailer from 'nodemailer'
import {google} from 'googleapis'

export const VerficationMail = ({to,subject,html}) => {
    const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2({
    clientId:process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET,
    redirectUri:process.env.REDIRECT_URI
})

oauth2Client.setCredentials({
    refresh_token:process.env.REFRESH_TOKEN
})

const accessToken = oauth2Client.getAccessToken();

const smtpTransport = nodemailer.createTransport({
    service:'gmail',
    auth:{
        type:'OAuth2',
        user:process.env.FROM_EMAIL,
        clientId:process.env.CLIENT_ID,
        clientSecret:process.env.CLIENT_SECRET,
        refreshToken:process.env.REFRESH_TOKEN,
        accessToken
    },
    tls:{
        rejectUnauthorized:false
    }
})

const mailOptions = {
    from: "amolw211@gmail.com",
    to,
    subject,
    generateTextFromHTML: true,
    html
};

smtpTransport.sendMail(mailOptions, (error, response) => {
    error ? console.log(error) : console.log(response);
    smtpTransport.close();
});


}

