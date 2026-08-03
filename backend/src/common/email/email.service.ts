import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendEmail(email: string, code: number) {
        console.log("boshi ishlayabdi")
        await this.mailerService.sendMail({
            to: email,
            subject: "Bu maxfiy kod",
            template: "index",
            context: { code }
        })
        console.log("oxiri ishlayabdi")
    }
}