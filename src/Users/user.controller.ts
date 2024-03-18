import { Controller, Get, Post } from '@nestjs/common'

@Controller('users')
export class UserController {
    @Get('a')
    getAllUser(): Object[] {
        return [
            { name: 'Hoang', age: 17 },
            { name: 'Phuc', age: 19 },
        ]
    }
}
