import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { JwtModule } from '@nestjs/jwt';
import { join } from 'path';

import { SeederModule } from './seeder/seeder.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './core/database/prisma.module';
import { CourcesModule } from './cources/cources/cources.module';
import { CategoryModule } from './cources/category/category.module';
import { SectionsModule } from './cources/sections/sections.module';
import { LessonsModule } from './cources/lessons/lessons.module';
import { MaterialsModule } from './cources/materials/materials.module';
import { HomeworksModule } from './cources/homeworks/homeworks.module';
import { AdminModule } from './modules/users/users.module';
import { ExamsModule } from './cources/exams/exams.module';
import { EmailModule } from './common/email/email.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'src', 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        index: false,
      },
    }),

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    JwtModule.register({
      secret: "shaptoli",
      signOptions: {
        expiresIn: '7d',
      },
    }),

    PrismaModule,
    SeederModule,
    AuthModule,
    AdminModule,
    CourcesModule,
    CategoryModule,
    SectionsModule,
    LessonsModule,
    MaterialsModule,
    HomeworksModule,
    ExamsModule,
    EmailModule
  ],
})
export class AppModule {}