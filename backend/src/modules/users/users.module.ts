import { Module } from '@nestjs/common';
import { AdminController, AssistentController, MentorController, StudentController } from './users.controller';
import { AssistentService, MentorService, StudentService, UserService } from './users.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AdminController, AssistentController, MentorController, StudentController],
  providers: [UserService, MentorService, AssistentService, StudentService]
})
export class AdminModule {}
