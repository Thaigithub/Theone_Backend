export class GetMembersResponse {
  constructor(members: any[], total: number) {
    this.members = members,
    this.total = total
  }

  members: any[]
  total: number
}
