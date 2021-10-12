import { UserService } from './../user/user.service';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

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
    throw new RpcException({
      message: 'Email already exist',
      code: 6,
    });
  }
}
