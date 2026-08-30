import { Module } from '@nestjs/common';
import { PurchaseCourceController } from './purchase-cource.controller';
import { PurchaseCourceService } from './purchase-cource.service';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';

@Module({
  imports: [AuthModule],
  controllers: [PurchaseCourceController],
  providers: [PurchaseCourceService, AuthGuard]
})
export class PurchaseCourceModule {}
