import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';

import { CreateUser } from './dto/createUser.DTO';
import { LoginUser } from './dto/loginUser.dto';
import { Metadata } from '@grpc/grpc-js';
import { UserService } from './user.service';
import { query } from 'express';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  //@GrpcMethod('UserService')
  async create(@Body() createUserDto: CreateUser) {
    const { email, password, name } = createUserDto;

    return await this.userService.create({ email, password, name });
  }

  @Get('/search')
  // @GrpcMethod('UserService')
  async search(@Query() query) {
    const { value, _id } = query;
    let searchUser: any = await this.userService.search(value, _id);
    return searchUser[0];
  }
  @Get('/confirm/:activeCode')
  // @GrpcMethod('UserService', 'VerifyUser')
  async verifyUser(@Param('activeCode') activeCode: string) {
    return await this.userService.verifyUser(activeCode);
  }

  @Get('/')
  //@GrpcMethod('UserService')
  async GetUser(@Query('token') token: string) {
    return await this.userService.getUser(token);
  }

  @Post('/login')
  //@GrpcMethod('UserService')
  async login(@Body() loginUser: LoginUser) {
    return await this.userService.login(loginUser);
  }

  @Get('/:id')
  //@GrpcMethod('UserService')
  async getById(@Param('id') id) {
    return await this.userService.getById(id);
  }
}
