import { Body, Controller, Post, UnauthorizedException, UsePipes } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe"
import { z } from "zod"
import { PrismaService } from "src/prisma/prisma.service"
import { compare } from "bcryptjs"


const autenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),

})

type autenticateBodySchema = z.infer<typeof autenticateBodySchema>


@Controller('/session')
export class AuthenticateController {
    constructor(private prisma: PrismaService,
        private jwt: JwtService
    ) { }

    @Post()
    @UsePipes(new ZodValidationPipe(autenticateBodySchema))
    async handle(@Body() body: autenticateBodySchema) {
        const { email, password } = body

        const user = await this.prisma.user.findUnique({
            where: {
                email,
            }
        })

        if (!user) {
            throw new UnauthorizedException('User credentials do not match.')
        }

        const IspasswordValid = await compare(password, user.password)


        if (!IspasswordValid) {
            throw new UnauthorizedException('User credentials do not match.')
        }


        const acessToken = this.jwt.sign({ sub: 'user-id' })

        return acessToken
    }
}
