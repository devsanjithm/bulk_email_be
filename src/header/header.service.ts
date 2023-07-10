import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { prismaFilterOptions } from 'src/helpers/objectParser';
import { STATUS_CODE } from 'src/helpers/statusCode';
import { CreateHeaderDto } from './dto/create-header.dto';
import { UpdateHeaderDto } from './dto/update-header.dto';

@Injectable()
export class HeaderService {
  constructor(private prismaClient: PrismaService) {}

  create(createHeaderDto: CreateHeaderDto) {
    return new Promise(async (resolve, reject) => {
      try {
        const find_header = await this.prismaClient.header.findFirst({
          where:{
            name:createHeaderDto.name
          }
        })
        if(find_header){
          return reject({
            code:STATUS_CODE.badRequest,
            message:'Header Name must Be Unique',
          })
        }
        const createHeader = await this.prismaClient.header.create({
          data: createHeaderDto,
        });
        if (createHeader) {
          return resolve({
            statusCode: STATUS_CODE.created,
            message: 'Header Created',
            data: createHeader,
          });
        } else {
          Logger.error(createHeader);
          return reject({
            statusCode: STATUS_CODE.badRequest,
            message: 'Header Not Created',
          });
        }
      } catch (error) {
        Logger.error(error);
        reject(error);
      }
    });
  }

  findAll(headerOptions: prismaFilterOptions) {
    return new Promise(async (resolve, reject) => {
      try {
        const getAllHeader = await this.prismaClient.header.findMany(
          headerOptions,
        );
        if (!getAllHeader) {
          return reject('Error While retriving Headers');
        }
        return resolve({
          statusCode: STATUS_CODE.success,
          message: 'Header Retrived',
          data: getAllHeader,
        });
      } catch (error) {
        Logger.error(error);
        reject(error);
      }
    });
  }

  findOne(id: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const header = await this.prismaClient.header.findUnique({
          where: {
            id,
          },
        });
        if (!header) {
          return reject({
            statusCode: STATUS_CODE.notFound,
            message: 'Header Not Found',
          });
        }
        return resolve({
          statusCode: STATUS_CODE.success,
          message: 'Header Retrived Successfully',
          data: header,
        });
      } catch (error) {
        Logger.error(error);
        reject(error);
      }
    });
  }

  update(id: string, updateHeaderDto: UpdateHeaderDto) {
    return new Promise(async (resolve, reject) => {
      try {
        const find_header = await this.prismaClient.header.findUnique({
          where: {
            id,
          },
        });
        if (!find_header) {
          return reject({
            statusCode: STATUS_CODE.notFound,
            message: 'Header Not Found',
          });
        }
        const update_header = await this.prismaClient.header.update({
          where: {
            id,
          },
          data: updateHeaderDto,
        });
        if (!update_header) {
          return reject({
            statusCode: STATUS_CODE.notFound,
            message: 'Update Header Failed',
          });
        }
        return resolve({
          statusCode: STATUS_CODE.success,
          message: 'Header Update Successfully',
          data: update_header,
        });
      } catch (error) {
        Logger.error(error);
        reject(error);
      }
    });
  }

  remove(id: number) {
    return `This action removes a #${id} header`;
  }
}
