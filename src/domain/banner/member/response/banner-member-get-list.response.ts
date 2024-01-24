import { FileResponse } from 'utils/generics/file.response';

export class BannerMemberGetListResponse {
    advertising: {
        file: FileResponse;
        title: string;
        urlLink: string;
        logoFile: FileResponse;
        urlFile: string;
    }[];
    post: {
        file: FileResponse;
        postId: number;
        logoFile: FileResponse;
        postName: string;
        siteName: string;
        endDate: Date;
        siteAddress: string;
        isInterested: boolean;
        urlFile: string;
        urlLogo: string;
    }[];
}
