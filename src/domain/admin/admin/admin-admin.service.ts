import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { $Enums, AccountStatus, AccountType, AdminLevel, Prisma } from '@prisma/client';
import { hash } from 'bcrypt';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { AdminAdminGetResponse } from './dto/admin-admin-response.dto';
import { AdminAdminSearchCategories } from './enum/admin-admin-search-category.enum';
import { AdminAdminGetListRequest } from './request/admin-admin-get-list.request';
import { AdminAdminUpsertRequest } from './request/admin-admin-upsert.request';
import { AdminAdminGetDetailResponse } from './response/admin-admin-detail.response';
import { AdminAdminGetListResponse } from './response/admin-admin-get-list.response';

@Injectable()
export class AdminAdminService {
    constructor(private prismaService: PrismaService) {}

    async getList(query: AdminAdminGetListRequest): Promise<AdminAdminGetListResponse> {
        const list = await this.findByQuery(query);

        const total = await this.countByQuery(query);
        return new PaginationResponse(list, new PageInfo(total));
    }

    async create(request: AdminAdminUpsertRequest): Promise<void> {
        await this.createAdmin(request);
    }

    async getMemberDetails(id: number): Promise<AdminAdminGetDetailResponse> {
        return await this.findById(id);
    }

    async changeAdminInfo(id: number, payload: AdminAdminUpsertRequest): Promise<void> {
        console.log(payload);
        await this.updateAdmin(id, payload);
    }

    async deleteAdmin(id: number): Promise<void> {
        await this.deleteAdminRepo(id);
    }

    private parseConditionsFromQuery(query: AdminAdminGetListRequest): Prisma.AdminWhereInput {
        return {
            isActive: true,
            ...(query.level && { level: AdminLevel[query.level] }),
            ...(query.searchCategory === AdminAdminSearchCategories.ID && {
                account: { username: { contains: query.keyword, mode: 'insensitive' } },
            }),
            ...(query.searchCategory === AdminAdminSearchCategories.ADMIN_NAME && {
                name: { contains: query.keyword, mode: 'insensitive' },
            }),
        };
    }

    async getPermissionsIds(permissions: $Enums.FunctionName[]): Promise<number[]> {
        const listFunctionID: number[] = [];
        console.log(permissions);
        for (const functionName of permissions) {
            const result = await this.prismaService.function.findFirst({
                where: {
                    name: functionName,
                },
            });
            if (result) listFunctionID.push(result.id);
        }
        console.log(listFunctionID);
        return listFunctionID;
    }

    async createAdmin(query: AdminAdminUpsertRequest) {
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
    }

    async findByQuery(query: AdminAdminGetListRequest): Promise<AdminAdminGetResponse[]> {
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
            ...QueryPagingHelper.queryPaging(query),
        });
    }

    async countByQuery(query: AdminAdminGetListRequest): Promise<number> {
        return await this.prismaService.admin.count({
            where: this.parseConditionsFromQuery(query),
        });
    }

    async findById(id: number): Promise<AdminAdminGetDetailResponse> {
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

    async updateAdmin(id: number, payload: AdminAdminUpsertRequest): Promise<void> {
        const listFunctionID = await this.getPermissionsIds(payload.permissions);

        const existAdmin = await this.prismaService.admin.findUnique({
            where: {
                isActive: true,
                id,
            },
            include: {
                account: true,
            },
        });

        if (!existAdmin) throw new NotFoundException('Admin not found');

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
                        password:
                            payload.password !== null && payload.password !== undefined
                                ? await hash(payload.password, 10)
                                : existAdmin.account.password,
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
            throw new InternalServerErrorException(error);
        } finally {
            await this.prismaService.$disconnect();
        }
    }
}
