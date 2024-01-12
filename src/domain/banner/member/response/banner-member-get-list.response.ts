import { FileResponse } from 'utils/generics/file.response';

export class BannerMemberGetListResponse {
    advertising: {
        file: FileResponse;
        title: string;
        urlLink: string;
    }[];
    post: {
        file: FileResponse;
        postId: number;
    }[];
}
