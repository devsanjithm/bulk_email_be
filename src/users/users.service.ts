import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { STATUS_CODE } from 'src/helpers/statusCode';

@Injectable()
export class UsersService {
  constructor(private prismaClient: PrismaService) {}
  create(CreateUserDto: any) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.prismaClient.users.create({
          data: CreateUserDto,
        });
        return resolve({
          statusCode: STATUS_CODE.created,
          message: 'Create User Success',
          data: user,
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
}
