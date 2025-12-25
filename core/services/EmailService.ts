import { Resend } from "resend";

// Initialize Resend with API key - gracefully handle missing key
let resend: Resend | null = null;

try {
  if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  } else {
    console.warn("RESEND_API_KEY not configured - email features will be disabled");
  }
} catch (error) {
  console.error("Failed to initialize Resend:", error);
}

export class EmailService {
  private fromEmail: string;

  constructor() {
    this.fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  }

  private async sendEmail(params: {
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    // Skip if Resend is not configured
    if (!resend) {
      console.log(`[Email skipped - not configured] To: ${params.to}, Subject: ${params.subject}`);
      return;
    }

    try {
      await resend.emails.send({
        from: this.fromEmail,
        to: params.to,
        subject: params.subject,
        html: params.html,
      });
      console.log(`[Email sent] To: ${params.to}, Subject: ${params.subject}`);
    } catch (error) {
      console.error(`[Email failed] To: ${params.to}, Subject: ${params.subject}`, error);
      // Don't throw - we don't want email failures to break the application
    }
  }

  /**
   * Send welcome email on user registration
   */
  async sendWelcomeEmail(email: string): Promise<void> {
    await this.sendEmail({
      to: email,
      subject: "Welcome to Apni Security!",
      html: this.getWelcomeEmailTemplate(email),
    });
  }

  /**
   * Send notification email when issue is created
   */
  async sendIssueCreatedEmail(
    email: string,
    issue: {
      type: string;
      title: string;
      description: string;
      priority: string;
      status: string;
    }
  ): Promise<void> {
    await this.sendEmail({
      to: email,
      subject: `New Issue Created: ${issue.title}`,
      html: this.getIssueCreatedTemplate(issue),
    });
  }

  /**
   * Send notification email when issue is updated
   */
  async sendIssueUpdatedEmail(
    email: string,
    issue: {
      type: string;
      title: string;
      description: string;
      priority: string;
      status: string;
    }
  ): Promise<void> {
    await this.sendEmail({
      to: email,
      subject: `Issue Updated: ${issue.title}`,
      html: this.getIssueUpdatedTemplate(issue),
    });
  }

  /**
   * Send notification email when profile is updated
   */
  async sendProfileUpdatedEmail(email: string): Promise<void> {
    await this.sendEmail({
      to: email,
      subject: "Profile Updated Successfully",
      html: this.getProfileUpdatedTemplate(email),
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(
    email: string,
    resetToken: string
  ): Promise<void> {
    await this.sendEmail({
      to: email,
      subject: "Password Reset Request",
      html: this.getPasswordResetTemplate(email, resetToken),
    });
  }

  // Email Templates

  private getWelcomeEmailTemplate(email: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 10px 10px 0 0;
              text-align: center;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              background: #667eea;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              color: #666;
              font-size: 12px;
              margin-top: 30px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎉 Welcome to Apni Security!</h1>
          </div>
          <div class="content">
            <h2>Hello!</h2>
            <p>Thank you for registering with Apni Security. We're excited to have you on board!</p>
            <p>Your account has been successfully created with the email: <strong>${email}</strong></p>
            <p>You can now:</p>
            <ul>
              <li>Create and manage security issues</li>
              <li>Track Cloud Security, Reteam Assessment, and VAPT issues</li>
              <li>Update your profile and preferences</li>
            </ul>
            <p>Get started by logging in to your account:</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/login" class="button">
              Go to Dashboard
            </a>
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p>Best regards,<br>The Apni Security Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Apni Security. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;
  }

  private getIssueCreatedTemplate(issue: {
    type: string;
    title: string;
    description: string;
    priority: string;
    status: string;
  }): string {
    const priorityColors: Record<string, string> = {
      LOW: "#10b981",
      MEDIUM: "#f59e0b",
      HIGH: "#f97316",
      CRITICAL: "#ef4444",
    };

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 10px 10px 0 0;
              text-align: center;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .issue-card {
              background: white;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: 600;
              margin-right: 8px;
            }
            .button {
              display: inline-block;
              background: #667eea;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              color: #666;
              font-size: 12px;
              margin-top: 30px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>✅ New Issue Created</h1>
          </div>
          <div class="content">
            <p>A new issue has been created in your Apni Security account.</p>
            <div class="issue-card">
              <h2>${issue.title}</h2>
              <div style="margin: 15px 0;">
                <span class="badge" style="background: ${priorityColors[issue.priority] || "#6b7280"}; color: white;">
                  ${issue.priority}
                </span>
                <span class="badge" style="background: #e5e7eb; color: #374151;">
                  ${issue.type.replace(/_/g, " ")}
                </span>
                <span class="badge" style="background: #dbeafe; color: #1e40af;">
                  ${issue.status.replace(/_/g, " ")}
                </span>
              </div>
              <p><strong>Description:</strong></p>
              <p>${issue.description}</p>
            </div>
            <p>You can view and manage this issue in your dashboard:</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/issues" class="button">
              View All Issues
            </a>
            <p>Best regards,<br>The Apni Security Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Apni Security. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;
  }

  private getIssueUpdatedTemplate(issue: {
    type: string;
    title: string;
    description: string;
    priority: string;
    status: string;
  }): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 10px 10px 0 0;
              text-align: center;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              background: #667eea;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              color: #666;
              font-size: 12px;
              margin-top: 30px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🔄 Issue Updated</h1>
          </div>
          <div class="content">
            <p>An issue in your Apni Security account has been updated.</p>
            <p><strong>Title:</strong> ${issue.title}</p>
            <p><strong>Status:</strong> ${issue.status.replace(/_/g, " ")}</p>
            <p><strong>Priority:</strong> ${issue.priority}</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/issues" class="button">
              View Issue
            </a>
            <p>Best regards,<br>The Apni Security Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Apni Security. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;
  }

  private getProfileUpdatedTemplate(email: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 10px 10px 0 0;
              text-align: center;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .footer {
              text-align: center;
              color: #666;
              font-size: 12px;
              margin-top: 30px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>✅ Profile Updated</h1>
          </div>
          <div class="content">
            <p>Your Apni Security profile has been successfully updated.</p>
            <p>Account: <strong>${email}</strong></p>
            <p>If you did not make this change, please contact our support team immediately.</p>
            <p>Best regards,<br>The Apni Security Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Apni Security. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;
  }

  private getPasswordResetTemplate(email: string, resetToken: string): string {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 10px 10px 0 0;
              text-align: center;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              background: #667eea;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .warning {
              background: #fef3c7;
              border: 1px solid #fcd34d;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              color: #666;
              font-size: 12px;
              margin-top: 30px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>We received a request to reset the password for your Apni Security account (<strong>${email}</strong>).</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" class="button">
              Reset Password
            </a>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
            <div class="warning">
              <strong>⚠️ Security Notice:</strong>
              <p>This link will expire in 1 hour for security reasons.</p>
              <p>If you did not request a password reset, please ignore this email and your password will remain unchanged.</p>
            </div>
            <p>Best regards,<br>The Apni Security Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Apni Security. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;
  }
}

// Export singleton instance
export const emailService = new EmailService();
