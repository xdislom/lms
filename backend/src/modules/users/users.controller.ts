import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AssistentService, MentorService, StudentService, UserService } from './users.service';
import { AdminDto, AssistentDto, MentorDto, StudentsDto, UpdateAdminDto, UpdateAssistentDto, UpdateMentorDto, UpdateStudentDto } from './dto/admin.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { Roles } from '@prisma/client';
import { Role } from 'src/decorator/roles';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles-guard';

@ApiBearerAuth()
@Controller('student')
@UseGuards(AuthGuard, RolesGuard)
@Role(Roles.ADMIN, Roles.SUPERADMIN, Roles.MENTOR)
export class StudentController {
    constructor(private readonly studentService: StudentService) { }

    @Get('student')
    @ApiOperation({ summary: 'ADMIN, SUPERADMIN, MENTOR' })
    getAllStudents() {
        return this.studentService.getAllStudents()
    }

    @Post('student')
    @ApiOperation({ summary: 'ADMIN, SUPERADMIN, MENTOR' })
    createStudent(@Body() payload: StudentsDto) {
        return this.studentService.createStudent(payload)
    }

    @Get('student/:id')
    @ApiOperation({ summary: 'ADMIN, SUPERADMIN, MENTOR' })
    getOneStudent(@Param('id', ParseIntPipe) id: number) {
        return this.studentService.getOneStudent(id)
    }

    @Patch('student/:id')
    @ApiOperation({ summary: 'ADMIN, SUPERADMIN, MENTOR' })
    updateStudent(
        @Body() payload: UpdateStudentDto,
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.studentService.updateStudent(payload, id)
    }

    @Delete('student/:id')
    @ApiOperation({ summary: 'ADMIN, SUPERADMIN, MENTOR' })
    deleteStudent(@Param('id', ParseIntPipe) id: number) {
        return this.studentService.deleteStudents(id)
    }
}

@ApiBearerAuth()
@Controller("admin")
@UseGuards(AuthGuard, RolesGuard)
@Role(Roles.ADMIN, Roles.SUPERADMIN)
export class AdminController {
    constructor(private readonly userService: UserService) { }

    @Get('admin')
    @ApiOperation({ summary: `${Roles.SUPERADMIN, Roles.ADMIN}` })
    getAllAdmin() {
        return this.userService.getAllAdmin()
    }

    @Post('admin')
    @ApiOperation({ summary: 'ADMIN, SUPERADMIN' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['name', 'phone', 'password'],
            properties: {
                file: {
                    type: 'string',
                    format: 'binary'
                },
                name: {
                    type: 'string'
                },
                phone: {
                    type: 'string'
                },
                password: {
                    type: 'string'
                },
                email: {
                    type: 'string'
                }
            }
        },
    })
    @UseInterceptors(FileInterceptor("file", {
        storage: diskStorage({
            destination: "./src/uploads/images",
            filename: (req, file, cb) => {
                const filename = new Date().getTime() + file.mimetype.split('/')[1]
                cb(null, filename)
            }
        })
    }))
    createAdmin(
        @Body() payload: AdminDto,
        @UploadedFile() file?: Express.Multer.File
    ) {
        return this.userService.createAdmin(payload, file?.filename)
    }

    @Patch('admin/:id')
    @ApiOperation({ summary: 'ADMIN, SUPERADMIN' })
    updateAdmin(
        @Body() payload: UpdateAdminDto,
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.userService.updateAdmin(payload, id)
    }

    @Delete('admin/:id')
    @ApiOperation({ summary: 'ADMIN, SUPERADMIN' })
    deleteAdmin(@Param('id', ParseIntPipe) id: number) {
        return this.userService.deleteAdmin(id)
    }
}

@ApiBearerAuth()
@Controller('mentor')
@UseGuards(AuthGuard, RolesGuard)
@Role(Roles.ADMIN, Roles.SUPERADMIN)
export class MentorController {
    constructor(private readonly mentorService: MentorService) { }

    @Get('mentor')
    @ApiOperation({ summary: 'ADMIN, SUPERADMIN' })
    getAllMentors() {
        return this.mentorService.gelAllMentors()
    }

    @Get('mentor/:id')
    @ApiOperation({ summary: 'ADMIN, SUPERADMIN' })
    getOneMentor(@Param('id', ParseIntPipe) id: number) {
        return this.mentorService.getOneMentor(id)
    }

    @Post('mentor')
    @ApiOperation({ summary: 'ADMIN, SUPERADMIN' })
    createMentor(@Body() payload: MentorDto) {
        return this.mentorService.createMentor(payload)
    }

    @Patch('mentor/:id')
    @ApiOperation({ summary: 'ADMIN, SUPERADMIN' })
    updateMentor(
        @Body() payload: UpdateMentorDto,
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.mentorService.updateMentor(payload, id)
    }

    @Delete('mentor/:id')
    @ApiOperation({ summary: 'ADMIN, SUPERADMIN' })
    deleteMentor(@Param('id', ParseIntPipe) id: number) {
        return this.mentorService.deleteMentor(id)
    }
}

@ApiBearerAuth()
@Controller('assistent')
@UseGuards(AuthGuard, RolesGuard)
@Role(Roles.ADMIN, Roles.SUPERADMIN)
export class AssistentController {
    constructor(private readonly assistentService: AssistentService) { }

    @Get('assistent')
    @ApiOperation({ summary: 'ADMIN, SUPERADMIN' })
    getAllAssistents() {
        return this.assistentService.gelAllAssistents()
    }

    @Get('assistent/:id')
    @ApiOperation({ summary: 'ADMIN, SUPERADMIN' })
    getOneAssistent(@Param('id', ParseIntPipe) id: number) {
        return this.assistentService.getOneAssistent(id)
    }

    @Post('assistent')
    @ApiOperation({ summary: 'ADMIN, SUPERADMIN' })
    createAssistent(@Body() payload: AssistentDto) {
        return this.assistentService.createAssistent(payload)
    }

    @Patch('assistent/:id')
    @ApiOperation({ summary: 'ADMIN, SUPERADMIN' })
    updateAssistent(
        @Body() payload: UpdateAssistentDto,
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.assistentService.updateAssistent(payload, id)
    }

    @Delete('assistent/:id')
    @ApiOperation({ summary: 'ADMIN, SUPERADMIN' })
    deleteAssistent(@Param('id', ParseIntPipe) id: number) {
        return this.assistentService.deleteAssistent(id)
    }
}
