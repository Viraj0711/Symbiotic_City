import nodemailer from 'nodemailer';
import logger from './logger';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: ReturnType<typeof nodemailer.createTransport>;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  private getEmailTemplate(content: string, preheader: string = ''): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Symbiotic City</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Arial', sans-serif; background-color: #E2EAD6; padding: 20px; }
    .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 40px 20px; text-align: center; }
    .logo { font-size: 32px; font-weight: bold; color: #ffffff; margin-bottom: 10px; }
    .tagline { color: #E2EAD6; font-size: 14px; }
    .content { padding: 40px 30px; color: #333333; line-height: 1.6; }
    .button { display: inline-block; padding: 14px 32px; background-color: #059669; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; transition: background-color 0.3s; }
    .button:hover { background-color: #047857; }
    .footer { background-color: #f8f9fa; padding: 30px; text-align: center; color: #666666; font-size: 13px; border-top: 1px solid #e2e8f0; }
    .footer-links { margin-top: 15px; }
    .footer-links a { color: #059669; text-decoration: none; margin: 0 10px; }
    .footer-links a:hover { text-decoration: underline; }
    .preheader { display: none; max-height: 0; overflow: hidden; }
    h1 { color: #059669; font-size: 24px; margin-bottom: 20px; }
    p { margin-bottom: 15px; }
    .highlight { background-color: #E2EAD6; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669; }
    .social-icons { margin-top: 20px; }
    .social-icons a { display: inline-block; margin: 0 8px; }
  </style>
</head>
<body>
  <span class="preheader">${preheader}</span>
  <div class="email-container">
    <div class="header">
      <div class="logo">🌱 Symbiotic City</div>
      <div class="tagline">Building Sustainable Communities Together</div>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p><strong>Symbiotic City</strong></p>
      <p>Creating sustainable communities through collaboration and innovation</p>
      <div class="footer-links">
        <a href="http://localhost:5173">Home</a> |
        <a href="http://localhost:5173/about">About</a> |
        <a href="http://localhost:5173/community">Community</a> |
        <a href="http://localhost:5173/contact">Contact</a>
      </div>
      <div class="social-icons">
        <a href="#" style="color: #059669;">Facebook</a>
        <a href="#" style="color: #059669;">Twitter</a>
        <a href="#" style="color: #059669;">Instagram</a>
      </div>
      <p style="margin-top: 20px; font-size: 11px; color: #999;">
        You are receiving this email because you are a member of Symbiotic City.<br>
        If you wish to unsubscribe, please <a href="#" style="color: #059669;">click here</a>.
      </p>
    </div>
  </div>
</body>
</html>
    `;
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      console.log('📧 [Email Service] Attempting to send email...');
      console.log('📧 [Email Service] SMTP Config:', {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
        from: process.env.SMTP_FROM_EMAIL,
        to: options.to,
        subject: options.subject
      });

      const info = await this.transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      console.log('✅ [Email Service] Email sent successfully!');
      logger.info(`Email sent: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error('❌ [Email Service] Failed to send email:');
      console.error('Error details:', error);
      logger.error('Error sending email:', error);
      return false;
    }
  }

  async sendWelcomeEmail(to: string, name: string): Promise<boolean> {
    const content = `
      <h1>Welcome to Symbiotic City, ${name}! 🎉</h1>
      <p>We're thrilled to have you join our community of sustainability advocates and changemakers!</p>
      
      <p>Symbiotic City is more than just a platform – it's a movement towards creating sustainable, collaborative communities where everyone can thrive together.</p>
      
      <div class="highlight">
        <strong>Here's what you can do:</strong>
        <ul style="margin-top: 10px; padding-left: 20px;">
          <li>🌍 Explore and join sustainable community projects</li>
          <li>📅 Participate in local events and workshops</li>
          <li>🛒 Browse our eco-friendly marketplace</li>
          <li>🤝 Connect with like-minded individuals</li>
          <li>💡 Share your own sustainability ideas</li>
        </ul>
      </div>
      
      <p style="text-align: center;">
        <a href="http://localhost:5173/dashboard" class="button">Get Started</a>
      </p>
      
      <p>If you have any questions, our community is here to help. Feel free to reach out!</p>
      
      <p>Together, we can build a more sustainable future.</p>
      
      <p style="margin-top: 30px;">
        Best regards,<br>
        <strong>The Symbiotic City Team</strong>
      </p>
    `;

    return this.sendEmail({
      to,
      subject: '🌱 Welcome to Symbiotic City!',
      html: this.getEmailTemplate(content, `Welcome ${name}! Start your sustainability journey with Symbiotic City.`),
      text: `Welcome to Symbiotic City, ${name}! We're excited to have you join our community.`,
    });
  }

  async sendEmailVerification(to: string, name: string, verificationToken: string): Promise<boolean> {
    const verificationUrl = `http://localhost:5173/verify-email?token=${verificationToken}`;
    
    const content = `
      <h1>Verify Your Email Address</h1>
      <p>Hi ${name},</p>
      
      <p>Thank you for signing up with Symbiotic City! To complete your registration and unlock all features, please verify your email address.</p>
      
      <div class="highlight">
        <p style="margin: 0;"><strong>Click the button below to verify your email:</strong></p>
      </div>
      
      <p style="text-align: center;">
        <a href="${verificationUrl}" class="button">Verify Email Address</a>
      </p>
      
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #059669; font-size: 12px;">${verificationUrl}</p>
      
      <p><strong>This link will expire in 24 hours.</strong></p>
      
      <p>If you didn't create an account with Symbiotic City, please ignore this email.</p>
      
      <p style="margin-top: 30px;">
        Best regards,<br>
        <strong>The Symbiotic City Team</strong>
      </p>
    `;

    return this.sendEmail({
      to,
      subject: '✅ Verify Your Symbiotic City Email',
      html: this.getEmailTemplate(content, 'Verify your email to activate your Symbiotic City account'),
      text: `Hi ${name}, please verify your email by clicking this link: ${verificationUrl}`,
    });
  }

  async sendPasswordReset(to: string, name: string, resetToken: string): Promise<boolean> {
    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;
    
    const content = `
      <h1>Password Reset Request</h1>
      <p>Hi ${name},</p>
      
      <p>We received a request to reset your password for your Symbiotic City account.</p>
      
      <div class="highlight">
        <p style="margin: 0;"><strong>Click the button below to reset your password:</strong></p>
      </div>
      
      <p style="text-align: center;">
        <a href="${resetUrl}" class="button">Reset Password</a>
      </p>
      
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #059669; font-size: 12px;">${resetUrl}</p>
      
      <p><strong>This link will expire in 1 hour.</strong></p>
      
      <p style="color: #dc2626; background-color: #fee2e2; padding: 15px; border-radius: 8px;">
        ⚠️ <strong>Security Notice:</strong> If you didn't request a password reset, please ignore this email and ensure your account is secure. Your password will remain unchanged.
      </p>
      
      <p style="margin-top: 30px;">
        Best regards,<br>
        <strong>The Symbiotic City Team</strong>
      </p>
    `;

    return this.sendEmail({
      to,
      subject: '🔐 Reset Your Symbiotic City Password',
      html: this.getEmailTemplate(content, 'Reset your password to regain access to your account'),
      text: `Hi ${name}, reset your password by clicking this link: ${resetUrl}`,
    });
  }

  async sendPasswordChanged(to: string, name: string): Promise<boolean> {
    const content = `
      <h1>Password Successfully Changed</h1>
      <p>Hi ${name},</p>
      
      <p>This is a confirmation that your Symbiotic City account password was successfully changed.</p>
      
      <div class="highlight">
        <p style="margin: 0;">
          <strong>When:</strong> ${new Date().toLocaleString()}<br>
          <strong>Account:</strong> ${to}
        </p>
      </div>
      
      <p style="color: #dc2626; background-color: #fee2e2; padding: 15px; border-radius: 8px;">
        ⚠️ <strong>Didn't change your password?</strong><br>
        If you didn't make this change, your account may be compromised. Please contact us immediately at support@symbioticcity.com.
      </p>
      
      <p>For your security, we recommend:</p>
      <ul style="padding-left: 20px;">
        <li>Use a unique password for Symbiotic City</li>
        <li>Enable two-factor authentication</li>
        <li>Never share your password with anyone</li>
      </ul>
      
      <p style="margin-top: 30px;">
        Best regards,<br>
        <strong>The Symbiotic City Team</strong>
      </p>
    `;

    return this.sendEmail({
      to,
      subject: '✅ Password Changed - Symbiotic City',
      html: this.getEmailTemplate(content, 'Your password has been changed successfully'),
      text: `Hi ${name}, your Symbiotic City password was successfully changed.`,
    });
  }

  async sendEventReminder(to: string, name: string, eventName: string, eventDate: string, eventLocation: string): Promise<boolean> {
    const content = `
      <h1>Event Reminder 📅</h1>
      <p>Hi ${name},</p>
      
      <p>This is a friendly reminder about an upcoming event you're registered for:</p>
      
      <div class="highlight">
        <p style="margin: 0;">
          <strong>📌 Event:</strong> ${eventName}<br>
          <strong>🕒 Date:</strong> ${eventDate}<br>
          <strong>📍 Location:</strong> ${eventLocation}
        </p>
      </div>
      
      <p>We're looking forward to seeing you there! This is a great opportunity to connect with other community members and contribute to our sustainability goals.</p>
      
      <p style="text-align: center;">
        <a href="http://localhost:5173/events" class="button">View Event Details</a>
      </p>
      
      <p style="margin-top: 30px;">
        See you soon,<br>
        <strong>The Symbiotic City Team</strong>
      </p>
    `;

    return this.sendEmail({
      to,
      subject: `📅 Reminder: ${eventName} - Symbiotic City`,
      html: this.getEmailTemplate(content, `Upcoming event: ${eventName} on ${eventDate}`),
      text: `Hi ${name}, reminder about ${eventName} on ${eventDate} at ${eventLocation}.`,
    });
  }

  async sendProjectUpdate(to: string, name: string, projectName: string, updateMessage: string): Promise<boolean> {
    const content = `
      <h1>Project Update 🚀</h1>
      <p>Hi ${name},</p>
      
      <p>There's a new update for <strong>${projectName}</strong>, a project you're following:</p>
      
      <div class="highlight">
        <p>${updateMessage}</p>
      </div>
      
      <p style="text-align: center;">
        <a href="http://localhost:5173/projects" class="button">View Project</a>
      </p>
      
      <p>Stay engaged and keep making a difference in your community!</p>
      
      <p style="margin-top: 30px;">
        Best regards,<br>
        <strong>The Symbiotic City Team</strong>
      </p>
    `;

    return this.sendEmail({
      to,
      subject: `🚀 Update: ${projectName} - Symbiotic City`,
      html: this.getEmailTemplate(content, `New update for ${projectName}`),
      text: `Hi ${name}, new update for ${projectName}: ${updateMessage}`,
    });
  }

  async sendPromotionalEmail(to: string, name: string, title: string, message: string, ctaText: string, ctaUrl: string): Promise<boolean> {
    const content = `
      <h1>${title}</h1>
      <p>Hi ${name},</p>
      
      <p>${message}</p>
      
      <p style="text-align: center;">
        <a href="${ctaUrl}" class="button">${ctaText}</a>
      </p>
      
      <p>Thank you for being part of the Symbiotic City community and helping us build a more sustainable future together!</p>
      
      <p style="margin-top: 30px;">
        Best regards,<br>
        <strong>The Symbiotic City Team</strong>
      </p>
    `;

    return this.sendEmail({
      to,
      subject: `${title} - Symbiotic City`,
      html: this.getEmailTemplate(content, message.substring(0, 100)),
      text: `Hi ${name}, ${message}`,
    });
  }

  async sendNewMessageNotification(to: string, name: string, senderName: string, messagePreview: string): Promise<boolean> {
    const content = `
      <h1>New Message 💬</h1>
      <p>Hi ${name},</p>
      
      <p>You have a new message from <strong>${senderName}</strong>:</p>
      
      <div class="highlight">
        <p style="font-style: italic; color: #666;">"${messagePreview}"</p>
      </div>
      
      <p style="text-align: center;">
        <a href="http://localhost:5173/dashboard" class="button">View Message</a>
      </p>
      
      <p style="margin-top: 30px;">
        Best regards,<br>
        <strong>The Symbiotic City Team</strong>
      </p>
    `;

    return this.sendEmail({
      to,
      subject: `💬 New message from ${senderName} - Symbiotic City`,
      html: this.getEmailTemplate(content, `${senderName} sent you a message`),
      text: `Hi ${name}, you have a new message from ${senderName}: ${messagePreview}`,
    });
  }

  async sendMarketplaceOrderConfirmation(to: string, name: string, orderId: string, items: string[], total: string): Promise<boolean> {
    const itemsList = items.map(item => `<li>${item}</li>`).join('');
    
    const content = `
      <h1>Order Confirmation 🛒</h1>
      <p>Hi ${name},</p>
      
      <p>Thank you for your order! We've received your purchase and it's being processed.</p>
      
      <div class="highlight">
        <p style="margin: 0;">
          <strong>Order ID:</strong> #${orderId}<br>
          <strong>Total:</strong> ${total}
        </p>
        <p style="margin-top: 15px;"><strong>Items:</strong></p>
        <ul style="margin: 10px 0; padding-left: 20px;">
          ${itemsList}
        </ul>
      </div>
      
      <p style="text-align: center;">
        <a href="http://localhost:5173/dashboard" class="button">View Order Details</a>
      </p>
      
      <p>We'll notify you when your order ships. Thank you for supporting sustainable marketplace!</p>
      
      <p style="margin-top: 30px;">
        Best regards,<br>
        <strong>The Symbiotic City Team</strong>
      </p>
    `;

    return this.sendEmail({
      to,
      subject: `✅ Order Confirmation #${orderId} - Symbiotic City`,
      html: this.getEmailTemplate(content, `Your order #${orderId} has been confirmed`),
      text: `Hi ${name}, your order #${orderId} has been confirmed. Total: ${total}`,
    });
  }

  async sendSellerNewOrderNotification(to: string, sellerName: string, orderId: string, buyerName: string, items: string[], total: string): Promise<boolean> {
    const itemsList = items.map(item => `<li>${item}</li>`).join('');
    
    const content = `
      <h1>New Order Received! 🎉</h1>
      <p>Hi ${sellerName},</p>
      
      <p>Great news! You have received a new order on Symbiotic City marketplace.</p>
      
      <div class="highlight">
        <p style="margin: 0;">
          <strong>Order ID:</strong> #${orderId}<br>
          <strong>Customer:</strong> ${buyerName}<br>
          <strong>Total:</strong> ${total}<br>
          <strong>Status:</strong> Pending
        </p>
        <p style="margin-top: 15px;"><strong>Items Ordered:</strong></p>
        <ul style="margin: 10px 0; padding-left: 20px;">
          ${itemsList}
        </ul>
      </div>
      
      <p style="text-align: center;">
        <a href="http://localhost:5173/owner/dashboard" class="button">View Order & Update Status</a>
      </p>
      
      <p><strong>Next Steps:</strong></p>
      <ul style="padding-left: 20px;">
        <li>Review the order details</li>
        <li>Prepare the items for delivery</li>
        <li>Update the order status to 'Processing'</li>
        <li>Arrange delivery according to customer preferences</li>
      </ul>
      
      <p>Thank you for contributing to our sustainable marketplace!</p>
      
      <p style="margin-top: 30px;">
        Best regards,<br>
        <strong>The Symbiotic City Team</strong>
      </p>
    `;

    return this.sendEmail({
      to,
      subject: `🎉 New Order #${orderId} - Symbiotic City`,
      html: this.getEmailTemplate(content, `You received a new order from ${buyerName}`),
      text: `Hi ${sellerName}, you have a new order #${orderId} from ${buyerName}. Total: ${total}`,
    });
  }
}

export const emailService = new EmailService();
