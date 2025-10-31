# Email Service Testing Guide

## 🎯 Email Service Overview

Your Symbiotic City application now has a complete email notification system with beautiful branded templates!

### ✅ Features Implemented

1. **Welcome Email** - Sent when new users register
2. **Email Verification** - For account activation
3. **Password Reset** - Secure password recovery
4. **Password Changed** - Confirmation after password change
5. **Event Reminders** - Upcoming event notifications
6. **Project Updates** - Project activity notifications
7. **New Messages** - Message notifications
8. **Promotional Emails** - Marketing campaigns
9. **Order Confirmations** - Marketplace purchase confirmations

### 🎨 Email Template Design

All emails feature:

- **Brand Colors**: #059669 (green) and #E2EAD6 (background)
- **Symbiotic City Logo** with tagline
- **Responsive Design** for mobile and desktop
- **Call-to-Action Buttons** with hover effects
- **Footer** with links and social media
- **Professional Layout** with consistent spacing

## 🧪 Testing Email Service

### Method 1: Using Postman or Thunder Client

**Test Welcome Email:**

POST <http://localhost:3001/api/test-email/test-welcome>
Content-Type: application/json

{
  "email": "<your-email@gmail.com>",
  "name": "Your Name"
}

**Test Verification Email:**

POST <http://localhost:3001/api/test-email/test-verification>
Content-Type: application/json

{
  "email": "<your-email@gmail.com>",
  "name": "Your Name"
}

**Test Password Reset Email:**

POST <http://localhost:3001/api/test-email/test-reset>
Content-Type: application/json

{
  "email": "<your-email@gmail.com>",
  "name": "Your Name"
}

**Test Event Reminder:**

POST <http://localhost:3001/api/test-email/test-event>
Content-Type: application/json

{
  "email": "<your-email@gmail.com>",
  "name": "Your Name"
}

**Test Promotional Email:**

POST <http://localhost:3001/api/test-email/test-promo>
Content-Type: application/json

{
  "email": "<your-email@gmail.com>",
  "name": "Your Name"
}

**Test Order Confirmation:**

POST <http://localhost:3001/api/test-email/test-order>
Content-Type: application/json

{
  "email": "<your-email@gmail.com>",
  "name": "Your Name"
}

### Method 2: Using cURL (PowerShell)

```powershell
# Test Welcome Email
Invoke-RestMethod -Uri "http://localhost:3001/api/test-email/test-welcome" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"your-email@gmail.com","name":"Your Name"}'

# Test Password Reset
Invoke-RestMethod -Uri "http://localhost:3001/api/test-email/test-reset" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"your-email@gmail.com","name":"Your Name"}'
```

### Method 3: Register a New User

Simply register a new account on your frontend:

1. Go to <http://localhost:5173/signup>
2. Fill in the registration form
3. Submit
4. Check your email for the welcome message!

## 📧 Current SMTP Configuration

From: Symbiotic City <symbioticcity@gmail.com>
SMTP Server: smtp.gmail.com
Port: 587 (TLS)

## 🔧 Email Service Integration

### Automatic Emails

The following emails are sent automatically:

**1. User Registration**:

- **Trigger**: `/api/auth/register` endpoint
- **Email**: Welcome email
- **When**: Immediately after successful registration

**2. Password Change**:

- **Trigger**: `/api/auth/change-password` endpoint
- **Email**: Password changed confirmation
- **When**: After password is successfully updated

**3. OAuth Registration**:

- **Trigger**: OAuth login endpoints (Facebook, Google, etc.)
- **Email**: Welcome email
- **When**: First time user logs in via OAuth

### Available API Endpoints for Manual Email Sending

You can integrate these into your frontend as needed:

**Forgot Password:**

POST /api/auth/forgot-password
Body: { "email": "<user@example.com>" }
**Change Password (Authenticated):**

POST /api/auth/change-password
Headers: Authorization: Bearer {token}
Body: {
  "currentPassword": "old123",
  "newPassword": "New123!"
}

## 🎨 Customizing Email Templates

To customize email templates, edit:

backend/src/utils/emailService.ts

### Template Structure

Each email method follows this pattern:

```typescript
async sendEmailType(to: string, params...): Promise<boolean> {
  const content = `
    <h1>Email Title</h1>
    <p>Email content...</p>
    <div class="highlight">
      <!-- Important information -->
    </div>
    <a href="..." class="button">Call to Action</a>
  `;

  return this.sendEmail({
    to,
    subject: 'Email Subject',
    html: this.getEmailTemplate(content, 'Preheader text'),
    text: 'Plain text version'
  });
}
```

### Available CSS Classes

- `.highlight` - Highlighted box with border
- `.button` - Green call-to-action button
- Standard HTML: `<h1>`, `<p>`, `<ul>`, `<li>`, `<strong>`

## 📝 Adding New Email Templates

1. **Add method to EmailService class:**

```typescript
async sendYourNewEmail(to: string, param1: string): Promise<boolean> {
  const content = `
    <h1>Your Title</h1>
    <p>${param1}</p>
  `;

  return this.sendEmail({
    to,
    subject: 'Your Subject',
    html: this.getEmailTemplate(content),
    text: 'Plain text version'
  });
}
```

1. **Use in your routes:**

```typescript
import { emailService } from '../utils/emailService';

// In your route handler
await emailService.sendYourNewEmail(user.email, someData);
```

## 🚨 Troubleshooting

### Email Not Sending

1. **Check SMTP credentials**
   - Verify `SMTP_USER` and `SMTP_PASS` in `.env`
   - Ensure app password is correct (no spaces)

2. **Check Gmail settings**
   - 2-Step Verification must be enabled
   - App password must be generated for this app
   - Less secure apps should be OFF (use app password instead)

3. **Check logs**
   - Backend terminal shows email sending status
   - Look for "Email sent: {messageId}" for success
   - Check for error messages

4. **Test SMTP connection**

   POST <http://localhost:3001/api/test-email/test-welcome>

### Email Goes to Spam

- Add SPF/DKIM records for your domain (production only)
- Use a verified sender email
- Avoid spam trigger words in subject lines
- Include unsubscribe links

### Styling Not Showing

- Email clients have limited CSS support
- Template uses inline styles for compatibility
- Test in multiple email clients (Gmail, Outlook, etc.)

## 🔒 Security Notes

- ✅ App password stored in `.env` (not committed to git)
- ✅ Rate limiting on email endpoints
- ✅ Email validation before sending
- ✅ HTTPS required for production
- ✅ No email enumeration on password reset

## 📊 Email Analytics (Future Enhancement)

Consider adding:

- Email open tracking
- Click tracking
- Delivery status monitoring
- Bounce handling
- Unsubscribe management

## 🌐 Production Deployment

Before going live:

1. **Update URLs** in email templates
   - Change `http://localhost:5173` to your production domain
   - Update in `emailService.ts` getEmailTemplate() method

2. **Use Environment Variables**

   ```env
   FRONTEND_URL=https://yourdomain.com
   ```

3. **Consider Email Service Providers**
   - SendGrid
   - Mailgun
   - AWS SES
   - Better deliverability and analytics

4. **Add Email Queue**
   - Use Bull or BeeQueue
   - Handle email failures gracefully
   - Retry failed sends

## 📞 Support

If emails aren't working:

1. Check backend console for errors
2. Verify SMTP credentials
3. Test with `/api/test-email` endpoints
4. Check spam folder

Happy emailing! 📬
