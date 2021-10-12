import { LoginUser } from './dto/loginUser.dto';
import { ClientProxy, GrpcMethod, RpcException } from '@nestjs/microservices';
import { CreateUser } from './dto/createUser.DTO';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @Inject('NOTIFY_SERVICE') private client: ClientProxy,
    @InjectModel('User') private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}
  async all() {
    return await this.userModel.find({});
  }
  async getByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async search(value: string, id: string) {
    return await this.userModel.aggregate([
      {
        $facet: {
          searchByEmail: [
            {
              $match: {
                $and: [
                  { email: { $regex: '' + value + '' } },
                  { _id: { $ne: new Types.ObjectId(id) } },
                ],
              },
            },
            {
              $project: {
                password: 0,
                active: 0,
                activeCode: 0,
              },
            },
          ],
          searchByName: [
            {
              $match: {
                $and: [
                  { name: { $regex: '' + value + '' } },
                  { _id: { $ne: new Types.ObjectId(id) } },
                ],
              },
            },
            {
              $project: {
                password: 0,
                active: 0,
                activeCode: 0,
              },
            },
          ],
        },
      },
    ]);
  }

  async create(user: CreateUser) {
    let active = false;
    let activeCode = this.jwtService.sign(user.email);
    const randomId = Math.trunc(Math.random() * 1000);
    const avatar = `https://picsum.photos/id/${randomId}/300/300`;
    this.client.emit('register', {
      name: user.name,
      email: user.email,
      url: `${process.env.GATEWAY_URL}/user/confirm/${activeCode}`,
    });
    return await new this.userModel({
      ...user,
      active,
      activeCode,
      avatar,
    }).save();
  }

  async login(loginUser: LoginUser) {
    let user: User = await this.userModel.findOne({
      ...loginUser,
      active: true,
    });

    if (user)
      return {
        token: this.jwtService.sign(
          { _id: user._id },
          {
            expiresIn: 6000,
          },
        ),
      };
    throw new RpcException({
      message: 'Wrong email or password or account is not actived',
      code: 3,
    });
  }

  async getUser(token: string) {
    try {
      let payload = this.jwtService.verify(token);

      let { _id, email, name, role, avatar } = await this.userModel.findById(
        payload._id,
      );
      return { _id, email, name, role, avatar };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        code: 3,
      });
    }
  }

  async getById(id: string) {
    try {
      let { _id, email, name, role, avatar } = await this.userModel.findById(
        id,
      );
      return { _id, email, name, role, avatar };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        code: 3,
      });
    }
  }

  async verifyUser(activeCode: string) {
    let user = await this.userModel.findOne({ activeCode });

    if (user) {
      return this.userModel.findByIdAndUpdate(user._id, {
        $set: { active: true },
      });
    }
    throw new RpcException('Can not active your account');
  }
}
