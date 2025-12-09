import nodemailer from 'nodemailer';

export class EmailService {
  private static transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: 'test@example.com',
      pass: 'testpassword'
    }
  });

  static async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    try {
      const info = await this.transporter.sendMail({
        from: '"Talent Risk AI" <noreply@talentrisk.ai>',
        to,
        subject,
        html
      });
      console.log('Email sent:', info.messageId);
      return true;
    } catch (error) {
      console.error('Email sending error:', error);
      return false;
    }
  }

  static async sendWelcomeEmail(to: string, name: string): Promise<boolean> {
    const html = `<h1>Welcome to Talent Risk AI, ${name}!</h1><p>Your account has been created.</p>`;
    return this.sendEmail(to, 'Welcome to Talent Risk AI', html);
  }

  static async sendNotification(to: string, message: string): Promise<boolean> {
    const html = `<h2>Notification</h2><p>${message}</p>`;
    return this.sendEmail(to, 'Notification', html);
  }

  static async sendRiskAlert(to: string, teamName: string, riskLevel: string): Promise<boolean> {
    const html = `<h2>Risk Alert</h2><p>Team <strong>${teamName}</strong> has <strong>${riskLevel.toUpperCase()}</strong> risk.</p>`;
    return this.sendEmail(to, `Risk Alert: ${teamName}`, html);
  }
}