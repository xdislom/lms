import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedSuperAdmin();
  }

  async seedSuperAdmin() {
    const user = await this.prisma.user.findFirst({
      where: {
        phone: '+998997652928',
      },
    });

    if (user) {
      Logger.log('✅ SuperAdmin already exists');
      return;
    }

    const password = await argon2.hash('Islom15');

    await this.prisma.user.create({
      data: {
        name: 'Islom',
        phone: '+998997652928',
        password: password,
        role: 'SUPERADMIN'
      },
    });

    Logger.log('✅ SuperAdmin created');
  }
}