import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, MAIL_REFHRESH_TOKEN, MAIL_SYSTEM } from 'app.config';
import { google } from 'googleapis';
import { MailContext } from './dto/mail.context';
@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}
    private async setTransport() {
        const OAuth2 = google.auth.OAuth2;
        const oauth2Client = new OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, 'https://developers.google.com/oauthplayground');
        oauth2Client.setCredentials({
            refresh_token: MAIL_REFHRESH_TOKEN,
        });

        const accessToken: string = await new Promise((resolve) => {
            oauth2Client.getAccessToken((err, token) => {
                if (err) {
                    console.log(err);
                }
                resolve(token);
            });
        });
        this.mailerService.addTransporter('gmail', {
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: MAIL_SYSTEM,
                clientId: GOOGLE_CLIENT_ID,
                clientSecret: GOOGLE_CLIENT_SECRET,
                accessToken,
            },
        });
    }
    async sendEmail(to: string, subject: string, context: MailContext, template: string): Promise<void> {
        await this.setTransport();
        this.mailerService.sendMail({
            transporterName: 'gmail',
            to,
            from: MAIL_SYSTEM,
            subject,
            template: `mail.${template}.template.hbs`,
            context,
        });
    }
}
