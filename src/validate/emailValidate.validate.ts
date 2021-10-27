import { HttpException, Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { RpcException } from '@nestjs/microservices';
import { UserService } from './../user/user.service';

@ValidatorConstraint({ name: 'UserExist', async: true })
@Injectable()
export class EmailValidate implements ValidatorConstraintInterface {
  constructor(readonly userService: UserService) {}
  async validate(value: any): Promise<boolean> {
    let user = await this.userService.getByEmail(value);
    if (user) return false;
    return true;
  }

  defaultMessage?(validationArguments?: ValidationArguments): string {
    throw new HttpException(
      {
        message: 'Email already exist',
        code: 401,
      },
      401,
    );
  }
}
