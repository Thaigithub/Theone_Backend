import { Body, Controller, Post } from '@nestjs/common';
import { ProductWebhookService } from './product-webhook.service';

@Controller('/webhook/products')
export class ProductWebhookController {
    constructor(private productWebhookService: ProductWebhookService) {}
    @Post('/payment/verification')
    async verifyPayment(@Body() body: any): Promise<void> {
        await this.productWebhookService.verifyPayment(body);
    }
}
