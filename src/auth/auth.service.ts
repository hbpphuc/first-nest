import { ForbiddenException, Injectable, Get } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AuthDto } from './dto/auth.dto'
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private jwt: JwtService,
        private config: ConfigService,
    ) {}

    async signToken(userId: number, email: string): Promise<{ access_token: string }> {
        const payload = { sub: userId, email }

        const secret = await this.jwt.signAsync(payload, {
            secret: this.config.get('JWT_SECRET'),
            expiresIn: this.config.get('JWT_EXPIRESIN'),
        })

        return { access_token: secret }
    }

    async signup(dto: AuthDto) {
        try {
            const hash = await argon.hash(dto.password)
            const user = await this.prismaService.user.create({
                data: {
                    email: dto.email,
                    hash,
                },
            })
            return this.signToken(user.id, user.email)
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials taken')
                }
            }
            throw error
        }
    }
    async signin(dto: AuthDto) {
        const user = await this.prismaService.user.findFirst({
            where: { email: dto.email },
        })

        if (!user) throw new ForbiddenException('Credentials incorrect')

        const pwMatches = await argon.verify(user.hash, dto.password)
        if (!pwMatches) throw new ForbiddenException('Credentials incorrect')

        return this.signToken(user.id, user.email)
    }
}
