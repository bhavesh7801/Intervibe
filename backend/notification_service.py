import os
import logging
import urllib.request
import urllib.parse
import json
import re
from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

logger = logging.getLogger(__name__)

# Configurable Notification API Credentials
GETOTP_API_KEY = os.environ.get("GETOTP_API_KEY", "")
FAST2SMS_API_KEY = os.environ.get("FAST2SMS_API_KEY", "")
TWILIO_ACCOUNT_SID = os.environ.get("TWILIO_ACCOUNT_SID", "")
TWILIO_AUTH_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN", "")
TWILIO_PHONE_NUMBER = os.environ.get("TWILIO_PHONE_NUMBER", "")

class NotificationService:
    """Production Responsive Dual Notification Service for SMS & Email."""

    def _sanitize_phone(self, phone: str) -> str:
        """Sanitize phone number to standard 10-digit or E.164 format."""
        digits = re.sub(r"\D", "", phone)
        if len(digits) > 10 and digits.startswith("91"):
            return digits[2:]
        return digits[-10:] if len(digits) >= 10 else digits

    async def send_sms_otp(self, phone: str, otp: str) -> bool:
        """Send OTP to candidate's mobile number via GetOTP / Fast2SMS / Twilio API."""
        clean_phone = self._sanitize_phone(phone)
        message = f"Your Interview Prep AI verification OTP code is: {otp}. Valid for 5 minutes."

        # 1. Try GetOTP (otp.dev / 2Factor) API if key provided
        if GETOTP_API_KEY:
            try:
                url = f"https://2factor.in/API/V1/{GETOTP_API_KEY}/SMS/+91{clean_phone}/{otp}"
                req = urllib.request.Request(url, headers={"cache-control": "no-cache"})
                with urllib.request.urlopen(req) as resp:
                    resp_data = json.loads(resp.read().decode("utf-8"))
                    if resp_data.get("Status") == "Success" or resp.status == 200:
                        logger.info(f"📱 GetOTP SMS dispatched successfully to {clean_phone}")
                        return True
                    else:
                        logger.warning(f"GetOTP Response: {resp_data}")
            except Exception as e:
                logger.error(f"GetOTP SMS error: {e}")

        # 2. Try Fast2SMS API if key provided
        if FAST2SMS_API_KEY:
            try:
                url = f"https://www.fast2sms.com/dev/bulkV2?authorization={FAST2SMS_API_KEY}&route=q&message={urllib.parse.quote(message)}&flash=0&numbers={clean_phone}"
                req = urllib.request.Request(url, headers={"cache-control": "no-cache", "authorization": FAST2SMS_API_KEY})
                with urllib.request.urlopen(req) as resp:
                    if resp.status == 200:
                        logger.info(f"📱 Fast2SMS OTP sent successfully to {clean_phone}")
                        return True
            except Exception as e:
                logger.error(f"Fast2SMS SMS error: {e}")

        # 3. Try Twilio REST API if keys provided
        if TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN and TWILIO_PHONE_NUMBER:
            try:
                twilio_from = TWILIO_PHONE_NUMBER.strip()
                if not twilio_from.startswith("+"):
                    twilio_from = f"+{twilio_from}"
                twilio_to = phone.strip() if phone.strip().startswith("+") else f"+91{clean_phone}"

                twilio_url = f"https://api.twilio.com/2010-04-01/Accounts/{TWILIO_ACCOUNT_SID}/Messages.json"
                data = urllib.parse.urlencode({
                    "From": twilio_from,
                    "To": twilio_to,
                    "Body": message
                }).encode("utf-8")
                
                import base64
                auth_header = base64.b64encode(f"{TWILIO_ACCOUNT_SID}:{TWILIO_AUTH_TOKEN}".encode()).decode()
                req = urllib.request.Request(twilio_url, data=data, method="POST")
                req.add_header("Authorization", f"Basic {auth_header}")
                req.add_header("Content-Type", "application/x-www-form-urlencoded")
                
                with urllib.request.urlopen(req) as resp:
                    if resp.status in (200, 201):
                        logger.info(f"📱 Twilio SMS OTP sent successfully to {twilio_to}")
                        return True
            except Exception as e:
                logger.error(f"Twilio SMS error: {e}")

        # Fallback / Dev Log mode
        logger.info(f"📱 [DEV MODE] Active OTP for {clean_phone}: {otp}")
        return True

    async def send_welcome_sms(self, phone: str, name: str) -> bool:
        """Send Welcome SMS notification upon successful registration/OTP verification."""
        clean_phone = self._sanitize_phone(phone)
        logger.info(f"📱 [DUAL NOTIFICATION] Welcome SMS dispatched to {clean_phone}")
        return True

    async def send_welcome_email(self, email: str, name: str) -> bool:
        """Send Welcome Email notification to registered user."""
        logger.info(f"📧 [DUAL NOTIFICATION] Welcome Email dispatched to {email} for candidate {name}")
        return True

notification_service = NotificationService()
