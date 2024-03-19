import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { PrismaModule } from './prisma/prisma.module'
import { UserController } from './user/user.controller'
import { JwtStrategy } from './auth/strategy'

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, PrismaModule],
    controllers: [AppController, UserController],
    providers: [AppService, JwtStrategy],
})
export class AppModule {}
