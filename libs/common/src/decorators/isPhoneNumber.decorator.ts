import { parsePhoneNumberFromString } from 'libphonenumber-js';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function IsPhoneNumber(
  countries: string[],
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [countries],
      validator: PhoneNumberConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsPhoneNumber' })
export class PhoneNumberConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (typeof value !== 'string') return false;

    const validCountries = args.constraints[0];
    const parsed = parsePhoneNumberFromString(value);

    return parsed !== undefined && validCountries.includes(parsed.country);
  }
}
