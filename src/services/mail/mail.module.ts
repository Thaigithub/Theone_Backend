import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
@Module({
    imports: [
        MailerModule.forRoot({
            transport: `smtps://${process.env.EMAIL}:${process.env.EMAIL_PASSWORD}@mail.google.com`,
            template: {
                dir: process.cwd() + 'src/services/mail/template',
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
    ],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {}
