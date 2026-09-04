import { Injectable, OnModuleInit } from "@nestjs/common";
import { Action, Ctx, InjectBot, On, Start, Update } from "nestjs-telegraf";
import { type BotContext, Step } from "./bot.session";
import { Context, Markup, Telegraf } from "telegraf";
import { BotService } from "./bot.service";
import { randomInt } from "crypto";

@Update()
@Injectable()
export class BotUpdate implements OnModuleInit {
    constructor(
        @InjectBot() private readonly bot: Telegraf<Context>,
        private readonly botService: BotService,
    ) { }

    onModuleInit() {
        this.bot.catch((err: any, ctx) => {
            if (err.response && err.response.error_code === 403) {
                console.warn(`Foydalanuvchi botni bloklagan: ${ctx.from?.id}`)
            } else {
                console.error(`Xatolik yuz berdi (${ctx.updateType}):`, err)
            }
        })
    }

    @Start()
    async start(@Ctx() ctx: BotContext) {
        ctx.session.step = Step.start
        await ctx.reply(
            "Assalomu aleykum Hurmatli Mijoz 😊\n\n Telefon raqamingizni jonating va tastiqlash kodingizni oling✅",
            Markup.keyboard([
                [Markup.button.contactRequest("📱 Telefon raqamni yuborish")],
            ])
                .resize()
                .oneTime(),
        );
    }

    @On("contact")
    async giveCode(@Ctx() ctx: BotContext) {
        const contact = (ctx.message as any)?.contact

        if (!contact) {
            return
        }

        const phone = contact.phone_number

        const user = await this.botService.findUser(phone)

        if (!user) {
            await ctx.reply("❌ Sizning telefon raqamingiz bazada yo'q")
            return
        }

        const code = randomInt(100000, 1000000).toString()

        await this.botService.createTelegramOtp(user.id, code)

        await ctx.reply(`Sizning tasdiqlash kodingiz:\n\n${code}`)
    }
}