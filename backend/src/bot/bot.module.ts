import { Module } from '@nestjs/common';
import { TelegrafModule } from "nestjs-telegraf"
import { session } from "telegraf"
import { BotUpdate } from './bot.update';
import { BotService } from './bot.service';
import { PrismaModule } from 'src/core/database/prisma.module';

@Module({
    imports: [
        PrismaModule,
        TelegrafModule.forRootAsync({
            useFactory: () => ({
                token: process.env.BOT_TOKEN as string,
                middlewares: [session()]
            })
        })
    ],
    providers: [BotUpdate, BotService]
})
export class BotModule {}
