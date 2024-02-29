import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
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

  async login(user: IUser) {
    const { _id, name, email, role } = user;
    const payload = {
      sub: 'Token Login',
      iss: 'From Server',
      _id,
      name,
      email,
      role,
    };
    return {
      result: {
        access_token: this.jwtService.sign(payload),
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
}
