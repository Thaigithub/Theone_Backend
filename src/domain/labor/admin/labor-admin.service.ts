import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { ExcelService } from 'services/excel/excel.service';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { LaborAdminGetListHistoryRequest } from './request/labor-admin-get-list-history.request';
import { GetListHistoryResponse, LaborAdminGetListHistoryResponse } from './response/labor-admin-get-list-history.response';

@Injectable()
export class LaborAdminService {
    constructor(
        private prismaService: PrismaService,
        private excelService: ExcelService,
    ) {}

    async getListHistory(id: number, query: LaborAdminGetListHistoryRequest): Promise<LaborAdminGetListHistoryResponse> {
        const search = {
            select: {
                contract: {
                    select: {
                        application: {
                            select: {
                                member: {
                                    select: {
                                        name: true,
                                    },
                                },
                                team: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                },
                workDates: true,
            },
            where: {
                contract: {
                    application: {
                        post: {
                            siteId: id,
                        },
                    },
                },
            },
            ...QueryPagingHelper.queryPaging(query),
        };
        const lists = (await this.prismaService.labor.findMany(search)).map((list) => {
            return {
                workerName: !list.contract.application.member
                    ? list.contract.application.team.name
                    : list.contract.application.member.name,
                workDay: list.workDates
                    .filter((workdate) => workdate.date.toISOString().includes(query.date))
                    .map((item) => item.date),
            };
        });

        const count = await this.prismaService.labor.count({ where: search.where });

        return new PaginationResponse(lists, new PageInfo(count));
    }

    async downloadHistory(id: number, query: LaborAdminGetListHistoryRequest, response: Response) {
        const lists = (
            await this.prismaService.labor.findMany({
                select: {
                    contract: {
                        select: {
                            application: {
                                select: {
                                    member: {
                                        select: {
                                            name: true,
                                        },
                                    },
                                    team: {
                                        select: {
                                            name: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    workDates: {
                        select: {
                            date: true,
                        },
                    },
                },
                where: {
                    contract: {
                        application: {
                            post: {
                                siteId: id,
                            },
                        },
                    },
                },
            })
        ).map((list) => {
            return {
                workerName: !list.contract.application.member
                    ? list.contract.application.team.name
                    : list.contract.application.member.name,
                workDay: list.workDates
                    ? list.workDates
                          .filter((workdate) => workdate.date.toISOString().includes(query.date))
                          .map((item) => item.date)
                    : [],
            };
        });

        const year = parseInt(query.date.split('-')[0]);
        const month = parseInt(query.date.split('-')[1]);
        const numberOfDays = new Date(year, month, 0).getDate();
        const excelTemplate = this.displayListExcelTemplate(numberOfDays, query.date, lists);

        const excelStream = await this.excelService.createExcelFile(excelTemplate, 'WorkHistory_' + query.date);
        response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        response.setHeader('Content-Disposition', `attachment; filename=WorkHistory_${query.date}.xlsx`);
        excelStream.pipe(response);
    }

    displayListExcelTemplate(numberOfDays: number, targetDate: string, listResponse: GetListHistoryResponse[]) {
        const excelTemplate = [];

        listResponse.forEach((item) => {
            const temp = { ...item };

            for (let day = 1; day < numberOfDays + 1; day++) {
                temp[`${targetDate}-${day}`] = item.workDay
                    .map((date) => date.toISOString())
                    .includes(`${targetDate}-${day}T00:00:00.000Z`)
                    ? 'O'
                    : '';
                delete temp.workDay;
            }
            excelTemplate.push(temp);
        });

        return excelTemplate;
    }
}
