import { Global, Module } from "@nestjs/common";
import { join } from "path";
import { MailerModule } from "@nestjs-modules/mailer"
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { EmailService } from "./email.service";

@Global()
@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                }
            },
            defaults: {
                from: `"n105" <iskandarovislom1118@gmail.com>`
            },

            template: {
                dir: join(process.cwd(), "src", "templates"),
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        })
    ],
    providers: [EmailService],
    exports: [EmailService]
})

export class EmailModule { }