import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
  isEnum,
} from 'class-validator';
import { getArrayNumberEnum } from '../utils/others.util';
import { UserGender } from '../constants/enums.constant';
import { UserMessage } from '../constants/message.constant';

export function IsEnumNumber(
  enumType: Object,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsEnumNumber', // Tên của decorator.
      target: object.constructor, // Loại đối tượng mà decorator sẽ được áp dụng
      propertyName: propertyName, // Tên của thuộc tính mà decorator sẽ được áp dụng.
      constraints: [enumType], // Một mảng các ràng buộc
      options: validationOptions, // Các tùy chọn cho quy tắc kiểm tra. Đây là tùy chọn và có thể bỏ qua
      validator: {
        validate(value: number) {
          console.log(value);

          console.log(isEnum(value, enumType));

          return isEnum(value, enumType) && typeof value === 'number';
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${propertyName} must match ${relatedPropertyName}`;
        },
      },
    });
  };
}
