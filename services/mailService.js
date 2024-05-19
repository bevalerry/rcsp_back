import nodemailer from 'nodemailer'
import { config } from "dotenv"
config()

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            },
            tls: {
                rejectUnauthorized: false 
            }
        })
        this.sendActivationMail = this.sendActivationMail.bind(this)
    }

    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: "Пройдите аутентификацию)",
            text: '',
            html: `
                <div>
                    <h1>Для аутентификации перейдите по ссылке</h1>
                    <p>обновите страницу если аутентифицируетесь с другого устройства<p>
                    <a href="${link}" target="__blank">Активировать</a>
                </div>
            `
        })
    }
}

export const mailService = new MailService();