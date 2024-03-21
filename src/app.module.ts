import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { UserController } from './user/user.controller'
import { JwtStrategy } from './auth/strategy'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthService } from './auth/auth.service'

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRoot(process.env.DATABASE),
        AuthModule,
    ],
    controllers: [UserController],
    providers: [JwtStrategy],
})
export class AppModule {}
