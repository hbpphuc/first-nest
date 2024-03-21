import { ForbiddenException, Injectable, Get } from '@nestjs/common'
import { AuthDto } from './dto/auth.dto'
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Model } from 'mongoose'
import { User } from '../models/user.model'
import { InjectModel } from '@nestjs/mongoose'

@Injectable()
export class AuthService {
    constructor(
        private jwt: JwtService,
        private config: ConfigService,
        @InjectModel('User') private userModel: Model<User>,
    ) {}

    async signToken(email: string): Promise<{ access_token: string }> {
        const payload = { email }

        const secret = await this.jwt.signAsync(payload, {
            secret: this.config.get('JWT_SECRET'),
            expiresIn: this.config.get('JWT_EXPIRESIN'),
        })

        return { access_token: secret }
    }

    async signup(dto: AuthDto) {
        try {
            const hash = await argon.hash(dto.password)
            const user = await this.userModel.create({
                data: {
                    email: dto.email,
                    password: hash,
                },
            })
            return this.signToken(user.email)
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
        const user = await this.userModel.findOne({
            where: { email: dto.email },
        })

        if (!user) throw new ForbiddenException('Credentials incorrect')

        const pwMatches = await argon.verify(user.password, dto.password)
        if (!pwMatches) throw new ForbiddenException('Credentials incorrect')

        return this.signToken(user.email)
    }
}
