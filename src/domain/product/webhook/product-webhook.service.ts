import { Injectable } from '@nestjs/common';
import { PortoneService } from 'services/portone/portone.service';

@Injectable()
export class ProductWebhookService {
    constructor(private portoneService: PortoneService) {}
    async verifyPayment(body: any): Promise<void> {
        const { imp_uid, merchant_uid } = body;
        await this.portoneService.verifyPayment(imp_uid, merchant_uid);
    }
}
