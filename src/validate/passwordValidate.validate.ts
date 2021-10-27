import { HttpException, Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

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
    throw new HttpException(
      'password must have at least 1 uppercase , 1 lowercase and 1 digit',
      401,
    );
  }
}
