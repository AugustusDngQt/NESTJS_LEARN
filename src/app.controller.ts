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
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
  ) {}

  @Get()
  @Render('homepage')
  getView() {
    console.log('>> Host: ', this.configService.get<string>('HOST'));
  }
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async handleLogin(@Request() req: any) {
    return req.user;
  }
}
