import { Injectable } from '@nestjs/common';
import { PostMemberService } from '../member/post-member.service';

@Injectable()
export class PostUserService extends PostMemberService {}
