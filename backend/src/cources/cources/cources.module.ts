import { Module } from '@nestjs/common';
import { CourcesController } from './cources.controller';
import { CourcesService } from './cources.service';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CourcesController],
  providers: [CourcesService]
})
export class CourcesModule {}
