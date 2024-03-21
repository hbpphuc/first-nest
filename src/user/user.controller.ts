import { Controller, Get, UseGuards } from '@nestjs/common'
import { JwtGuard } from 'src/auth/guard'
import { UserDeco } from './decorator/user.decorator'
import { User } from '@prisma/client'

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    @Get('me')
    getMe(@UserDeco() user: User, @UserDeco('email') email: string) {
        console.log({ email })
        return user
    }
}
