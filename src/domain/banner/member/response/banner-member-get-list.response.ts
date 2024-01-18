import { FileResponse } from 'utils/generics/file.response';

export class BannerMemberGetListResponse {
    advertising: {
        file: FileResponse;
        title: string;
        urlLink: string;
        logoFile: FileResponse;
    }[];
    post: {
        file: FileResponse;
        postId: number;
        logoFile: FileResponse;
    }[];
}
