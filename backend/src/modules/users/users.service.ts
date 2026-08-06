import { ConflictException, Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { AdminDto, AssistentDto, MentorDto, UpdateAdminDto, UpdateAssistentDto, UpdateMentorDto, UpdateStudentDto } from './dto/admin.dto';
import { PrismaService } from 'src/core/database/prisma.service';
import { Roles } from '@prisma/client';
import hashPassword from 'src/common/config/hash';
import * as argon2 from "argon2"

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async getAllAdmin() {
        const admins = await this.prisma.user.findMany({
            where: {
                role: Roles.ADMIN,
            },
            select: {
                id: true,
                name: true,
                phone: true,
                create_at: true,
                password: true,
                file: true
            },
        })

        return {
            success: true,
            data: admins
        }
    }

    async createAdmin(payload: AdminDto, filename?: string) {
        const existAdmin = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { phone: payload.phone },
                    { email: payload.email }
                ]
            }
        })

        if (existAdmin) {
            throw new ConflictException('Admin already exist with this phone or email')
        }


        await this.prisma.user.create({
            data: {
                ...payload,
                role: Roles.ADMIN,
                password: await hashPassword(payload.password),
                file: filename || null
            }
        })

        return {
            success: true,
            message: 'Admin created successfully!'
        }
    }

    async updateAdmin(payload: UpdateAdminDto, id: number) {
        const data = {
            ...payload
        }
        if (payload.password) {
            data.password = await hashPassword(payload.password);
        }

        await this.prisma.user.update({
            where: {
                id: id
            },
            data
        })

        return {
            success: true,
            message: 'Admin updated successfully!'
        }
    }

    async deleteAdmin(id: number) {
        await this.prisma.user.delete({
            where: {
                id: id
            }
        })

        return {
            success: true,
            message: 'Admin deleted successfully!'
        }
    }
}


@Injectable()
export class MentorService {
    constructor(private prisma: PrismaService) { }

    async gelAllMentors() {
        const mentors = await this.prisma.user.findMany({
            where: {
                role: Roles.MENTOR
            },
            select: {
                id: true,
                name: true,
                phone: true,
                role: true,
                password: true,
                create_at: true,
                mentor: {
                    select: {
                        experience: true,
                        job: true,
                        web_link: true,
                        description: true,
                        facebook: true,
                        telegram: true,
                        linkedIn: true,
                        instagtam: true,
                        github: true,
                    }
                }
            }
        })

        return {
            success: true,
            data: mentors
        }
    }

    async getOneMentor(id: number) {
        const existMentor = await this.prisma.user.findFirst({
            where: {
                role: Roles.MENTOR,
                id: id
            }
        })

        if (!existMentor) {
            throw new NotFoundException('Mentor not found with this id')
        }

        const mentor = await this.prisma.user.findFirst({
            where: {
                id: id
            }
        })

        return {
            success: true,
            data: mentor
        }
    }

    async createMentor(payload: MentorDto) {
        const existMentor = await this.prisma.user.findFirst({
            where: {
                phone: payload.phone
            }
        })

        if (existMentor) {
            throw new ConflictException('Mentor already exist with this phone')
        }

        await this.prisma.user.create({
            data: {
                name: payload.name,
                phone: payload.phone,
                password: await hashPassword(payload.password),
                email: payload.email,
                mentor: {
                    create: {
                        experience: Number(payload.experience),
                        job: payload.job,
                        web_link: payload.web_link,
                        description: payload.description,
                        facebook: payload.facebook,
                        telegram: payload.telegram,
                        linkedIn: payload.linkedIn,
                        instagtam: payload.instagtam,
                        github: payload.github
                    }
                },
                role: Roles.MENTOR
            }
        })

        return {
            success: true,
            message: 'Mentor created successfully!'
        }
    }

    async updateMentor(payload: UpdateMentorDto, id: number) {
        await this.prisma.user.update({
            where: {
                id: id
            },
            data: {
                ...payload
            }
        })

        return {
            success: true,
            message: 'Mentor updated successfully!'
        }
    }

    async deleteMentor(id: number) {
        await this.prisma.mentor.deleteMany({
            where: {
                userId: id,
            },
        });

        await this.prisma.user.delete({
            where: {
                id,
            },
        });

        return {
            success: true,
            message: 'Mentor deleted successfully!'
        }
    }
}


@Injectable()
export class AssistentService {
    constructor(private prisma: PrismaService) { }

    async gelAllAssistents() {
        const assistents = await this.prisma.user.findMany({
            where: {
                role: Roles.ASSISTENT
            },
            select: {
                id: true,
                name: true,
                phone: true,
                password: true,
                cources: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            }
        })

        return {
            success: true,
            data: assistents
        }
    }

    async getOneAssistent(id: number) {
        const assistent = await this.prisma.user.findFirst({
            where: {
                id: id
            }
        })

        return {
            success: true,
            data: assistent
        }
    }

    async createAssistent(payload: AssistentDto) {
        const existAssistent = await this.prisma.user.findFirst({
            where: {
                phone: payload.phone
            }
        })

        if (existAssistent) {
            throw new ConflictException('Assistent already exist with this phone')
        }

        const course = await this.prisma.cources.findUnique({
            where: {
                id: payload.courceId
            },
        });

        if (!course) {
            throw new NotFoundException("Course not found");
        }

        await this.prisma.user.create({
            data: {
                name: payload.name,
                phone: payload.phone,
                password: await hashPassword(payload.password),
                cources: {
                    connect: {
                        id: payload.courceId,
                    },
                },
                role: Roles.ASSISTENT
            }
        })

        return {
            success: true,
            message: 'Assistent created successfully!'
        }
    }

    async updateAssistent(payload: UpdateAssistentDto, id: number) {
        await this.prisma.user.update({
            where: {
                id: id
            },
            data: {
                ...payload
            }
        })

        return {
            success: true,
            message: 'Assistent updated successfully!'
        }
    }

    async deleteAssistent(id: number) {
        await this.prisma.user.delete({
            where: {
                id: id
            }
        })

        return {
            success: true,
            message: 'Mentor deleted successfully!'
        }
    }
}


@Injectable()
export class StudentService {
    constructor(private prisma: PrismaService) { }

    async getAllStudents() {
        const students = await this.prisma.user.findMany({
            where: {
                role: Roles.STUDENT
            },
            select: {
                id: true,
                name: true,
                phone: true,
                role: true,
                cources: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })

        return {
            success: true,
            data: students
        }
    }

    async getOneStudent(id: number) {
        const student = await this.prisma.user.findFirst({
            where: {
                role: Roles.STUDENT,
                id: id
            }
        })

        return {
            success: true,
            data: student
        }
    }

    async updateStudent(payload: UpdateStudentDto, id: number) {
        const existStudent = await this.prisma.user.findUnique({
            where: {
                id: id
            }
        })

        if (!existStudent) {
            throw new NotFoundException('Student not found with this id')
        }

        if (payload.phone) {
            const existPhone = await this.prisma.user.findUnique({
                where: {
                    phone: payload.phone
                }
            })

            if (existPhone && existPhone.id !== id) {
                throw new ConflictException('This phone number already exist')
            }
        }

        if(payload.email) {
            const existEmail = await this.prisma.user.findUnique({
                where: {
                    email: payload.email
                }
            })
    
            if (existEmail && existEmail.id !== id) {
                throw new ConflictException('This email already exist')
            }
        }



        await this.prisma.user.update({
            where: {
                id: id
            },
            data: {
                name: payload.name,
                password: payload.password,
                phone: payload.phone,
                email: payload.email
            }
        })

        return {
            success: true,
            message: 'Student updated successfully!'
        }
    }

    async deleteStudents(id: number) {
        await this.prisma.user.delete({
            where: {
                id: id
            }
        })

        return {
            success: true,
            message: 'Student deleted successfully!'
        }
    }
}