import {
  Controller,
  Get,
  Post,
  Render,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Public } from './decorators/is-public.decorator';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
    private authService: AuthService,
  ) {}

  @Get()
  @Render('homepage')
  getView() {
    console.log('>> Host: ', this.configService.get<string>('HOST'));
  }

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  async handleLogin(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
