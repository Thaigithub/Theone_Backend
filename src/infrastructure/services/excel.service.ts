import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs'
import { Readable } from 'stream';
@Injectable()
export class ExcelService {
    async createExcelFile(data: any[], worksheetName: string|null): Promise<Readable> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(worksheetName?worksheetName:'Sheet1');
    
        const headers = Object.keys(data[0]);
        worksheet.addRow(headers);

        data.forEach((item) => {
          const row = headers.map((header) => item[header]);
          worksheet.addRow(row);
        });
        const stream = new Readable();
        stream.push(await workbook.xlsx.writeBuffer());
        stream.push(null);
    
        return stream;
      }
}
