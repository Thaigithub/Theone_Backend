import { Member, Team, Account } from '@prisma/client';
export class GetAdminTeamResponse {
  id: Team['id'];
  code: Team['code'];
  name: Team['name'];
  isActive: Team['isActive'];
  status: Team['status'];
  leader: Member;
  members: Member[];
}

export class GetTeamMemberDetails {
  id: Member['id'];
  name: Member['name'];
  userName: string;
  contact: Member['contact'];
  level: Member['level'];
  memberStatus: Account['status'];
}
export class GetTeamDetailsResponse {
  members: GetTeamMemberDetails[];
  teamName: Team['name'];
}
