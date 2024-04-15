import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import ms from 'ms';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { UserMessage } from 'src/constants/message.constant';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { IUser } from 'src/users/users.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);

    if (user) {
      // check password
      const isValidPassword = this.usersService.isValidPassword(
        pass,
        user.password,
      );
      if (isValidPassword) return user;
    }

    return null;
  }

  async login(user: IUser, res: Response) {
    const { _id, name, email, role } = user;
    const refreshToken = this.createRefreshToken(user);
    const accessToken = this.createAccessToken(user);
    const update = await this.usersService.updateRefreshToken(
      _id,
      refreshToken,
    );
    if (!update) throw new BadRequestException(UserMessage.CANNOT_UPDATE_TOKEN);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge:
        ms(
          this.configService.get<string>(
            'JWT_REFRESH_TOKEN_EXPIRE_IN',
          ) as string,
        ) * 1000,
    });
    return {
      result: {
        accessToken,
        _id,
        name,
        email,
        role,
      },
    };
  }

  async register(payload: RegisterUserDto) {
    const hash = await this.usersService.getHashPassword(payload.password);

    if (await this.userModel.findOne({ email: payload.email }))
      throw new BadRequestException(UserMessage.EMAIL_IS_ALREADY_EXISTS);
    const user = await this.userModel.create({
      ...payload,
      password: hash,
      role: 'USER',
    });
    return { result: { _id: user._id, createdAt: user.createdAt } };
  }

  createRefreshToken(user: IUser) {
    const { _id, name, email, role } = user;
    const payload = {
      sub: 'Refresh Token',
      iss: 'From Server',
      _id,
      name,
      email,
      role,
    };
    return this.jwtService.sign(payload, {
      privateKey: this.configService.get<string>(
        'JWT_REFRESH_TOKEN_SECRET_KEY',
      ),
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE_IN'),
    });
  }

  createAccessToken(user: IUser) {
    const { _id, name, email, role } = user;
    const payload = {
      sub: 'Access Token',
      iss: 'From Server',
      _id,
      name,
      email,
      role,
    };
    return this.jwtService.sign(payload);
  }

  async handleRefreshToken(refreshToken: string) {
    try {
      const userVerify = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });
      const user = (await this.usersService.findOne(userVerify._id)).result;
      if (!user)
        throw new BadRequestException(
          UserMessage.TOKEN_IS_INVALID_OR_NOT_FOUND,
        );
      const { _id, name, email, role } = user;
      const payload = { _id: _id.toString(), name, email, role };
      return {
        accessToken: this.createAccessToken(payload),
        result: { _id, name, email, role },
      };
    } catch (error) {
      throw new BadRequestException(UserMessage.REFRESH_TOKEN_IS_INVALID);
    }
  }

  async logout(res: Response, user: IUser) {
    res.clearCookie('refreshToken');
    await this.usersService.updateRefreshToken(user._id, '');
    return 'OK';
  }
}
