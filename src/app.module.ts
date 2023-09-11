import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from './prisma/prisma.service'
import { CreateAccountController } from './controllers/create-acccout.controller'
import { envSchema } from "./env"
import { AuthModule } from './auth/auth.modules'
import { AuthenticateController } from './controllers/autenticate.controller'
import { JwtService } from "@nestjs/jwt"


@Module({
  imports: [ConfigModule.forRoot({
    validate: (env) => envSchema.parse(env),
    isGlobal: true,
  }),
    AuthModule
  ],
  controllers: [CreateAccountController, AuthenticateController],
  providers: [PrismaService],
})
export class AppModule { }
