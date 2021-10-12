import { Body, Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';

import { CreateUser } from './dto/createUser.DTO';
import { LoginUser } from './dto/loginUser.dto';
import { Metadata } from '@grpc/grpc-js';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @GrpcMethod('UserService')
  async create(data: CreateUser, metadata: Metadata) {
    return await this.userService.create(data);
  }

  @GrpcMethod('UserService')
  async search({ value, _id }) {
    let searchUser: any = await this.userService.search(value, _id);
    return searchUser[0];
  }
  @GrpcMethod('UserService')
  async getById({ id }) {
    return await this.userService.getById(id);
  }

  @GrpcMethod('UserService', 'VerifyUser')
  async verifyUser(data) {
    return await this.userService.verifyUser(data.activeCode);
  }

  @GrpcMethod('UserService')
  async GetUser(data) {
    return await this.userService.getUser(data.token);
  }

  @GrpcMethod('UserService')
  async login(loginUser: LoginUser) {
    return await this.userService.login(loginUser);
  }
}
