import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage } from 'src/decorators/customize.decorator';
import { LocalAuthGuard } from './local-auth.guard';
import { UserMessage } from 'src/constants/message.constant';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ResponseMessage(UserMessage.LOGIN_IS_SUCCESS)
  @Public()
  @UseGuards(LocalAuthGuard)
  async handleLogin(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @Public()
  @ResponseMessage(UserMessage.REGISTER_USER_IS_SUCCESS)
  async register(@Body() body: RegisterUserDto) {
    return await this.authService.register(body);
  }
}
