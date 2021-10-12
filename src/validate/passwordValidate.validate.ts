import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@ValidatorConstraint({ async: false })
@Injectable()
export class PasswordValidate implements ValidatorConstraintInterface {
  validate(password: string): boolean | Promise<boolean> {
    let hasNumber = /\d/;
    let hasUpper = /[A-Z]/;
    let hasLowwer = /[a-z]/;
    let hasBlank = /\s/;
    if (
      hasNumber.test(password) &&
      hasLowwer.test(password) &&
      hasUpper.test(password) &&
      !hasBlank.test(password)
    )
      return true;
    return false;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    throw new RpcException('invalid password');
  }
}
