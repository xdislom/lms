import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { MentorService } from './mentor.service';
import { Roles } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles-guard';
import { Role } from 'src/decorator/roles';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';


@ApiBearerAuth()
@Controller('mentor')
@UseGuards(AuthGuard, RolesGuard)
@Role(Roles.MENTOR)
export class MentorController {
    constructor(private readonly mentorService: MentorService) { }

    @Get('getAllMyCources')
    getAllMyCources(@Req() req) {
        return this.mentorService.getMyCources(req.user.id)
    }
}
