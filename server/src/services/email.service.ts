import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY is not defined');
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

type EmailOptions = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export class EmailService {
  static async sendWelcomeEmail(email: string, name: string): Promise<void> {
    try {
      const msg: EmailOptions = {
        to: email,
        from: process.env.EMAIL_FROM || 'no-reply@talentplatform.com',
        subject: 'Welcome to Talent Platform',
        text: `Hi ${name}, welcome to our platform!`,
        html: `<strong>Hi ${name}, welcome to our platform!</strong>`
      };

      await sgMail.send(msg);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      throw new Error('Failed to send welcome email');
    }
  }

  static async sendRiskAlertEmail(email: string, name: string, riskLevel: string): Promise<void> {
    try {
      const msg: EmailOptions = {
        to: email,
        from: process.env.EMAIL_FROM || 'no-reply@talentplatform.com',
        subject: `Risk Alert: ${riskLevel} risk detected`,
        text: `Hi ${name}, we've detected ${riskLevel} risk level in your team.`,
        html: `<p>Hi ${name},</p>
               <p>We've detected <strong>${riskLevel}</strong> risk level in your team.</p>`
      };

      await sgMail.send(msg);
    } catch (error) {
      console.error('Failed to send risk alert email:', error);
      throw new Error('Failed to send risk alert email');
    }
  }
}