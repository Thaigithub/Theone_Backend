import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { $Enums, AccountStatus, AccountType, Admin, AdminLevel } from '@prisma/client';
import { hash } from 'bcrypt';
import { ExcelService } from 'services/excel/excel.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { AdminLevelRequest, AdminSearchCategories } from './dto/admin-admin-search';
import { GetAdminListRequest } from './request/admin-admin-get-list.request';
import { AdminUpsertRequest } from './request/admin-admin-upsert.request';
import { GetAdminListResponse } from './response/admin-admin-list.response';
import { AdminResponse } from './response/admin-admin.response';

@Injectable()
export class AdminAdminService {
    constructor(
        private readonly excelService: ExcelService,
        private prismaService: PrismaService,
    ) {}
    async getList(query: GetAdminListRequest): Promise<GetAdminListResponse> {
        const list = await this.findByQuery(query);

        const total = await this.countByQuery(query);
        return new GetAdminListResponse(list, total);
    }

    async create(request: AdminUpsertRequest): Promise<void> {
        await this.createAdmin(request);
    }

    async getMemberDetails(id: number): Promise<Admin> {
        return await this.findById(id);
    }

    async changeAdminInfo(id: number, payload: AdminUpsertRequest): Promise<void> {
        await this.updateAdmin(id, payload);
    }

    async deleteAdmin(id: number): Promise<void> {
        await this.deleteAdminRepo(id);
    }

    private parseConditionsFromQuery(query: GetAdminListRequest) {
        return {
            isActive: true,
            ...(query.level !== AdminLevelRequest.ALL && { level: AdminLevel[query.level] }),
            ...(query.searchCategory === AdminSearchCategories.ID && { account: { username: { contains: query.keyword } } }),
            ...(query.searchCategory === AdminSearchCategories.ADMIN_NAME && { name: { contains: query.keyword } }),
            ...(query.searchCategory === AdminSearchCategories.ALL && {
                OR: [
                    {
                        account: { username: { contains: query.keyword } },
                    },
                    {
                        name: { contains: query.keyword },
                    },
                ],
            }),
        };
    }

    async getPermissionsIds(permissions: $Enums.FunctionName[]): Promise<number[]> {
        const listFunctionID: number[] = [];
        for (const functionName of permissions) {
            const result = await this.prismaService.function.findFirst({
                where: {
                    name: functionName,
                },
            });
            listFunctionID.push(result.id);
        }

        return listFunctionID;
    }

    async createAdmin(query: AdminUpsertRequest) {
        try {
            const listFunctionID = await this.getPermissionsIds(query.permissions);
            await this.prismaService.admin.create({
                data: {
                    name: query.name,
                    level: query.level,
                    account: {
                        create: {
                            username: query.username,
                            password: await hash(query.password, 10),
                            type: AccountType.ADMIN,
                            status: AccountStatus.APPROVED,
                        },
                    },
                    permissions: {
                        create: listFunctionID.map((functionId) => ({
                            functionId: functionId,
                        })),
                    },
                },
            });
        } catch (error) {
            throw new InternalServerErrorException('Server errors at creating admin account');
        }
    }

    async findByQuery(query: GetAdminListRequest): Promise<AdminResponse[]> {
        return await this.prismaService.admin.findMany({
            select: {
                id: true,
                name: true,
                level: true,
                account: {
                    select: {
                        username: true,
                        lastAccessAt: true,
                    },
                },
            },
            where: this.parseConditionsFromQuery(query),
            orderBy: {
                createdAt: 'desc',
            },

            // Pagination
            // If both pageNumber and pageSize is provided then handle the pagination
            skip: query.pageNumber && query.pageSize ? (query.pageNumber - 1) * query.pageSize : undefined,
            take: query.pageNumber && query.pageSize ? query.pageSize : undefined,
        });
    }

    async countByQuery(query: GetAdminListRequest): Promise<number> {
        return await this.prismaService.admin.count({
            // Conditions based on request query
            where: this.parseConditionsFromQuery(query),
        });
    }

    async findById(id: number): Promise<Admin> {
        return await this.prismaService.admin.findUnique({
            where: {
                id,
                isActive: true,
            },
            include: {
                account: {
                    select: {
                        username: true,
                    },
                },
                permissions: {
                    select: {
                        function: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });
    }

    async updateAdmin(id: number, payload: AdminUpsertRequest): Promise<void> {
        try {
            const listFunctionID = await this.getPermissionsIds(payload.permissions);

            await this.prismaService.admin.update({
                where: {
                    isActive: true,
                    id,
                },
                data: {
                    name: payload.name,
                    level: payload.level,
                    account: {
                        update: {
                            username: payload.username,
                            password: await hash(payload.password, 10),
                        },
                    },
                    permissions: {
                        deleteMany: {
                            adminId: id,
                        },
                        create: listFunctionID.map((functionId) => ({
                            functionId: functionId,
                        })),
                    },
                },
            });
        } catch (error) {
            throw new InternalServerErrorException('Server errors at update admin account');
        }
    }

    async deleteAdminRepo(id: number): Promise<void> {
        try {
            const deleteAdmin = this.prismaService.admin.update({
                where: {
                    id,
                    isActive: true,
                },
                data: {
                    isActive: false,
                    account: {
                        update: {
                            isActive: false,
                        },
                    },
                },
            });

            const deletePermissions = this.prismaService.permission.deleteMany({
                where: {
                    adminId: id,
                },
            });

            await this.prismaService.$transaction([deleteAdmin, deletePermissions]);
        } catch (error) {
            throw new InternalServerErrorException('Server errors at delete admin account');
        } finally {
            await this.prismaService.$disconnect();
        }
    }
}
