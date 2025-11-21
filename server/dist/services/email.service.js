"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    static async sendEmail(to, subject, html) {
        try {
            const info = await this.transporter.sendMail({
                from: '"Talent Risk AI" <noreply@talentrisk.ai>',
                to,
                subject,
                html
            });
            console.log('Email sent:', info.messageId);
            return true;
        }
        catch (error) {
            console.error('Email sending error:', error);
            return false;
        }
    }
    static async sendWelcomeEmail(to, name) {
        const html = `<h1>Welcome to Talent Risk AI, ${name}!</h1><p>Your account has been created.</p>`;
        return this.sendEmail(to, 'Welcome to Talent Risk AI', html);
    }
    static async sendNotification(to, message) {
        const html = `<h2>Notification</h2><p>${message}</p>`;
        return this.sendEmail(to, 'Notification', html);
    }
    static async sendRiskAlert(to, teamName, riskLevel) {
        const html = `<h2>Risk Alert</h2><p>Team <strong>${teamName}</strong> has <strong>${riskLevel.toUpperCase()}</strong> risk.</p>`;
        return this.sendEmail(to, `Risk Alert: ${teamName}`, html);
    }
}
exports.EmailService = EmailService;
EmailService.transporter = nodemailer_1.default.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: 'test@example.com',
        pass: 'testpassword'
    }
});
