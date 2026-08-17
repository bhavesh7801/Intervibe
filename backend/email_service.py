import os
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formataddr
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

# Professional System Brand Configuration
SENDER_NAME = os.getenv("SENDER_NAME", "Interview Prep AI").strip()
SENDER_EMAIL = os.getenv("SENDER_EMAIL", "noreply@interviewprep.ai").strip()

# SendGrid Primary Configuration
SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY", "").strip()

# SMTP Backup Configuration
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com").strip()
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "").strip()
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "").strip().replace(" ", "")

def send_otp_email(to_email: str, otp_code: str, user_name: str = "Candidate") -> bool:
    """
    Send a 6-digit OTP verification email to candidate's email address using SendGrid.
    Configured with brand display name: From("noreply@interviewprep.ai", "Interview Prep AI")
    """
    subject = f"[{otp_code}] Your Verification Code - {SENDER_NAME}"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0F0C1B; color: #E2E8F0; margin: 0; padding: 20px; }}
            .container {{ max-width: 520px; margin: 0 auto; background: #171227; border: 1px solid #F43F5E; border-radius: 16px; padding: 32px; text-align: center; box-shadow: 0 10px 30px rgba(244,63,94,0.2); }}
            .logo {{ font-size: 22px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px; margin-bottom: 24px; }}
            .logo span {{ color: #F43F5E; }}
            .otp-card {{ background: #090710; border: 2px solid #2B2144; border-radius: 12px; padding: 20px; margin: 24px 0; }}
            .otp-code {{ font-size: 38px; font-weight: 900; letter-spacing: 8px; color: #F43F5E; text-shadow: 0 0 15px rgba(244,63,94,0.4); margin: 10px 0; }}
            .expiry {{ font-size: 12px; color: #94A3B8; margin-top: 8px; }}
            .footer {{ font-size: 11px; color: #64748B; margin-top: 30px; border-top: 1px solid #2B2144; padding-top: 16px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">Interview Prep <span>AI</span></div>
            <p style="font-size: 15px; color: #CBD5E1;">Hi <strong>{user_name}</strong>,</p>
            <p style="font-size: 14px; color: #94A3B8;">Please use the 6-digit verification code below to complete your authentication:</p>
            
            <div class="otp-card">
                <div class="otp-code">{otp_code}</div>
                <div class="expiry">Code expires in 10 minutes</div>
            </div>

            <p style="font-size: 12px; color: #94A3B8;">If you did not request this code, please ignore this email.</p>
            <div class="footer">
                &copy; Interview Prep AI Platform. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    """

    # 1. Primary: SendGrid Transactional Email Dispatch with Brand Name
    if SENDGRID_API_KEY and "your_sendgrid_key" not in SENDGRID_API_KEY.lower():
        try:
            from sendgrid import SendGridAPIClient
            from sendgrid.helpers.mail import Mail, From, To, Content
            
            message = Mail(
                from_email=From(SENDER_EMAIL, SENDER_NAME),
                to_emails=To(to_email),
                subject=subject,
                html_content=Content("text/html", html_content)
            )
            sg = SendGridAPIClient(SENDGRID_API_KEY)
            resp = sg.send(message)
            if resp.status_code in [200, 201, 202]:
                logger.info(f"SendGrid system OTP email sent to {to_email}")
                print(f"\n[SENDGRID LIVE EMAIL SENT] From: {SENDER_NAME} <{SENDER_EMAIL}> | Destination: {to_email} | OTP Code: {otp_code}\n")
                return True
            else:
                logger.error(f"SendGrid returned status code: {resp.status_code}")
        except Exception as sg_err:
            logger.error(f"SendGrid dispatch error: {sg_err}")

    # 2. Secondary Backup: SMTP Dispatch
    if SMTP_USER and SMTP_PASSWORD:
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = formataddr((SENDER_NAME, SENDER_EMAIL))
            msg["To"] = to_email

            msg.attach(MIMEText(html_content, "html"))

            with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=15) as server:
                server.starttls()
                server.login(SMTP_USER, SMTP_PASSWORD)
                server.sendmail(SMTP_USER, to_email, msg.as_string())

            logger.info(f"Backup SMTP email successfully sent to {to_email}")
            print(f"\n[SMTP BACKUP EMAIL SENT] From: {SENDER_NAME} <{SENDER_EMAIL}> | Destination: {to_email} | OTP Code: {otp_code}\n")
            return True
        except Exception as e:
            logger.error(f"Backup SMTP dispatch error to {to_email}: {e}")

    # 3. Fallback print logger
    print("\n" + "="*70)
    print(f"[OTP SIMULATOR FALLBACK] From: {SENDER_NAME} <{SENDER_EMAIL}> | Destination: {to_email} | OTP Code: {otp_code}")
    print("="*70 + "\n")
    return True
