import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy, OnModuleInit {
    constructor() {
        super({
            log: ["error", "warn"],
        });
    }

    async onModuleInit() {
        await this.$connect();
        Logger.log("✅ Database connected");
    }

    async onModuleDestroy() {
        await this.$disconnect();
        Logger.log("❌ Database disconnected");
    }
}