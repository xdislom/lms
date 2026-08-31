import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { PurchaseCourceService } from './purchase-cource.service';
import { PurchaseDto } from './dto/purchaseCource.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles-guard';
import { Roles } from '@prisma/client';
import { Role } from 'src/decorator/roles';

@ApiBearerAuth()
@Controller('purchase-cource')
@UseGuards(AuthGuard, RolesGuard)
export class PurchaseCourceController {
    constructor(private readonly purchaseService: PurchaseCourceService) { }

    @Role(Roles.SUPERADMIN, Roles.ADMIN)
    @Get('all-purchases')
    getPurchases() {
        return this.purchaseService.getPurchases()
    }

    @Role(Roles.SUPERADMIN, Roles.ADMIN, Roles.STUDENT)
    @Get('purchased-cource/:id')
    getAllPurchases(@Param('id', ParseIntPipe) id: number) {
        return this.purchaseService.getAllPurchases(id)
    }

    @Role(Roles.STUDENT)
    @Post()
    purchaseCource(
        @Body() payload: PurchaseDto,
        @Req() req
    ) {
        return this.purchaseService.purchaseCource(payload, req.user.id)
    }

    @Patch(':userId/:courceId/approve')
    @Role(Roles.SUPERADMIN, Roles.ADMIN)
    approvePayment(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('courceId', ParseIntPipe) courceId: number,
    ) {
        return this.purchaseService.approvePayment(userId, courceId)
    }
    
}
