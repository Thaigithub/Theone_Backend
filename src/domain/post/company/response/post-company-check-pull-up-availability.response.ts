import { PostCompanyCheckPullUpStatus } from '../enum/post-company-check-pull-up-status.enum';

export class PostCompanyCheckPullUpAvailabilityResponse {
    pullUpAvailableStatus: PostCompanyCheckPullUpStatus;
    remainingTimes: number;
}
