import { $Enums, Member, File } from '@prisma/client';
import { BaseEntity } from './base.entity';

export class Certificate extends BaseEntity {
  constructor(
    id: number,
    name: string,
    certificateNumber: string,
    fileId: number,
    status: $Enums.CertificateStatus,
    acquisitionDate: Date,
    createdAt: Date,
    updatedAt: Date,
    memberId?: number,
    member?: Member,
    file?: File,
  ) {
    super();
    this.id = id;
    this.name = name;
    this.certificateNumber = certificateNumber;
    this.fileId = fileId;
    this.file = file;
    this.status = status;
    this.acquisitionDate = acquisitionDate;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.memberId = memberId;
    this.member = member;
  }
  id: number;
  name: string;
  fileId: number;
  file?: File;
  certificateNumber: string;
  status: $Enums.CertificateStatus;
  acquisitionDate: Date;
  createdAt: Date;
  updatedAt: Date;
  memberId?: number;
  member?: Member;
}
