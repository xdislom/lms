import { Module } from '@nestjs/common';
import { MentorController } from './mentor.controller';
import { MentorService } from './mentor.service';
import { PrismaService } from 'src/core/database/prisma.service';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';

@Module({
  imports: [AuthModule],
  controllers: [MentorController],
  providers: [MentorService, AuthGuard, PrismaService]
})
export class MentorModule {}
