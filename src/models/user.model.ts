import { Global } from '@nestjs/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema()
export class User {
    @Prop()
    name: string

    @Prop()
    email: string

    @Prop()
    password: string
}

export const UserSchema = SchemaFactory.createForClass(User)
