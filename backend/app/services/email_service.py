"""
Email service for sending emails via SMTP.
"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional

from app.core.config import settings


def send_email(
    to: str,
    subject: str,
    body: str,
    html_body: Optional[str] = None
) -> bool:
    """
    Send email via SMTP.
    
    Args:
        to: Recipient email address
        subject: Email subject
        body: Plain text email body
        html_body: Optional HTML email body
    
    Returns:
        True if email sent successfully, False otherwise
    """
    # Check if SMTP is configured
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        print(f"\n⚠️  SMTP not configured. Email would be sent to: {to}")
        print(f"Subject: {subject}")
        print(f"Body: {body}\n")
        return False
    
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['From'] = settings.SMTP_USER
        msg['To'] = to
        msg['Subject'] = subject
        
        # Add plain text body
        text_part = MIMEText(body, 'plain')
        msg.attach(text_part)
        
        # Add HTML body if provided
        if html_body:
            html_part = MIMEText(html_body, 'html')
            msg.attach(html_part)
        
        # Connect to SMTP server
        print(f"\n📧 Connecting to SMTP server: {settings.SMTP_SERVER}:{settings.SMTP_PORT}")
        server = smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT)
        server.starttls()  # Enable TLS encryption
        
        # Login
        print(f"📧 Logging in as: {settings.SMTP_USER}")
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        
        # Send email
        print(f"📧 Sending email to: {to}")
        server.send_message(msg)
        server.quit()
        
        print(f"✓ Email sent successfully to {to}\n")
        return True
        
    except smtplib.SMTPAuthenticationError as e:
        print(f"\n❌ SMTP Authentication Error: {e}")
        print("Check your SMTP_USER and SMTP_PASSWORD in .env file")
        print("For Gmail, you may need to use an App Password instead of your regular password")
        print("Generate one at: https://myaccount.google.com/apppasswords\n")
        return False
        
    except smtplib.SMTPException as e:
        print(f"\n❌ SMTP Error: {e}\n")
        return False
        
    except Exception as e:
        print(f"\n❌ Failed to send email: {e}\n")
        return False


def send_password_reset_email(to: str, reset_token: str, frontend_url: str = "http://localhost:5173") -> bool:
    """
    Send password reset email.
    
    Args:
        to: Recipient email address
        reset_token: Password reset token
        frontend_url: Frontend URL for reset link
    
    Returns:
        True if email sent successfully, False otherwise
    """
    reset_url = f"{frontend_url}/reset-password?token={reset_token}"
    
    subject = "Password Reset Request - InfluConnect"
    
    # Plain text body
    body = f"""
Hello,

You requested a password reset for your InfluConnect account.

Click the link below to reset your password:
{reset_url}

This link will expire in 1 hour.

If you didn't request this, please ignore this email.

Best regards,
InfluConnect Team
"""
    
    # HTML body
    html_body = f"""
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }}
        .container {{
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }}
        .header {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }}
        .content {{
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }}
        .button {{
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }}
        .footer {{
            text-align: center;
            margin-top: 20px;
            color: #666;
            font-size: 12px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Password Reset Request</h1>
        </div>
        <div class="content">
            <p>Hello,</p>
            <p>You requested a password reset for your <strong>InfluConnect</strong> account.</p>
            <p>Click the button below to reset your password:</p>
            <p style="text-align: center;">
                <a href="{reset_url}" class="button">Reset Password</a>
            </p>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; background: white; padding: 10px; border-radius: 5px;">
                {reset_url}
            </p>
            <p><strong>⏰ This link will expire in 1 hour.</strong></p>
            <p>If you didn't request this, please ignore this email. Your password will remain unchanged.</p>
            <p>Best regards,<br>InfluConnect Team</p>
        </div>
        <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
        </div>
    </div>
</body>
</html>
"""
    
    return send_email(to, subject, body, html_body)


def send_welcome_email(to: str, user_name: str) -> bool:
    """
    Send welcome email to new users.
    
    Args:
        to: Recipient email address
        user_name: User's name
    
    Returns:
        True if email sent successfully, False otherwise
    """
    subject = "Welcome to InfluConnect! 🎉"
    
    body = f"""
Hello {user_name},

Welcome to InfluConnect! We're excited to have you on board.

Your account has been successfully created. You can now:
- Complete your profile
- Connect with brands/influencers
- Start collaborating

Get started: http://localhost:5173/signin

If you have any questions, feel free to reach out to our support team.

Best regards,
InfluConnect Team
"""
    
    html_body = f"""
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }}
        .container {{
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }}
        .header {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }}
        .content {{
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }}
        .button {{
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Welcome to InfluConnect!</h1>
        </div>
        <div class="content">
            <p>Hello {user_name},</p>
            <p>Welcome to <strong>InfluConnect</strong>! We're excited to have you on board.</p>
            <p>Your account has been successfully created. You can now:</p>
            <ul>
                <li>✓ Complete your profile</li>
                <li>✓ Connect with brands/influencers</li>
                <li>✓ Start collaborating</li>
            </ul>
            <p style="text-align: center;">
                <a href="http://localhost:5173/signin" class="button">Get Started</a>
            </p>
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p>Best regards,<br>InfluConnect Team</p>
        </div>
    </div>
</body>
</html>
"""
    
    return send_email(to, subject, body, html_body)
