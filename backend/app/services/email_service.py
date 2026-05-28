"""
Email delivery via Gmail API (OAuth2).
Falls back to a console log when credentials are missing (development).
"""
import os
import json
import base64
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text      import MIMEText

logger = logging.getLogger(__name__)

SENDER = os.environ.get("GMAIL_SENDER_EMAIL", "reservas@hotelrural.es")
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000")


def _get_gmail_service():
    try:
        from google.oauth2.credentials import Credentials
        from googleapiclient.discovery  import build

        creds = Credentials(
            token=None,
            refresh_token=os.environ["GMAIL_REFRESH_TOKEN"],
            client_id=os.environ["GMAIL_CLIENT_ID"],
            client_secret=os.environ["GMAIL_CLIENT_SECRET"],
            token_uri="https://oauth2.googleapis.com/token",
        )
        return build("gmail", "v1", credentials=creds, cache_discovery=False)
    except (KeyError, Exception) as e:
        logger.warning("Gmail API not configured: %s", e)
        return None


def _send(service, to: str, subject: str, html: str):
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"]    = SENDER
    msg["To"]      = to
    msg.attach(MIMEText(html, "html"))

    raw = base64.urlsafe_b64encode(msg.as_bytes()).decode()
    service.users().messages().send(userId="me", body={"raw": raw}).execute()


def send_verification_email(reservation):
    verify_url = f"{FRONTEND_URL}/verificar/{reservation.verify_token}"
    nights = (reservation.check_out - reservation.check_in).days

    html = f"""
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#FDF6F0;font-family:'Segoe UI',Arial,sans-serif;">
      <div style="max-width:580px;margin:40px auto;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.08);">

        <!-- Header -->
        <div style="background:linear-gradient(135deg,#C0392B,#E67E22);padding:40px 32px;text-align:center;">
          <div style="width:52px;height:52px;background:rgba(255,255,255,.2);border-radius:16px;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;">
            <span style="font-size:24px;">🏔️</span>
          </div>
          <h1 style="margin:0;color:#fff;font-size:26px;font-weight:700;letter-spacing:-.5px;">Hotel Rural</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,.8);font-size:14px;">Confirma tu reserva</p>
        </div>

        <!-- Body -->
        <div style="padding:36px 32px;">
          <h2 style="margin:0 0 8px;color:#2C1810;font-size:20px;">Hola, {reservation.guest_name.split()[0]} 👋</h2>
          <p style="color:#8B7355;line-height:1.6;margin-bottom:24px;">
            Gracias por elegir Hotel Rural. Para confirmar tu reserva, haz clic en el botón de abajo.
            El enlace es válido durante <strong>24 horas</strong>.
          </p>

          <!-- Reservation summary -->
          <div style="background:#FDF6F0;border-radius:16px;padding:20px;margin-bottom:28px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:6px 0;color:#8B7355;font-size:14px;">Apartamento</td>
                  <td style="padding:6px 0;color:#2C1810;font-weight:600;text-align:right;font-size:14px;">{reservation.apartment.name}</td></tr>
              <tr><td style="padding:6px 0;color:#8B7355;font-size:14px;">Llegada</td>
                  <td style="padding:6px 0;color:#2C1810;font-weight:600;text-align:right;font-size:14px;">{reservation.check_in.strftime('%d/%m/%Y')}</td></tr>
              <tr><td style="padding:6px 0;color:#8B7355;font-size:14px;">Salida</td>
                  <td style="padding:6px 0;color:#2C1810;font-weight:600;text-align:right;font-size:14px;">{reservation.check_out.strftime('%d/%m/%Y')}</td></tr>
              <tr><td style="padding:6px 0;color:#8B7355;font-size:14px;">Noches</td>
                  <td style="padding:6px 0;color:#2C1810;font-weight:600;text-align:right;font-size:14px;">{nights}</td></tr>
              <tr style="border-top:1px solid #e8d8c0;">
                <td style="padding:12px 0 6px;color:#2C1810;font-weight:700;font-size:15px;">Total</td>
                <td style="padding:12px 0 6px;color:#E67E22;font-weight:700;font-size:18px;text-align:right;">{reservation.total_price}€</td>
              </tr>
            </table>
          </div>

          <!-- CTA -->
          <div style="text-align:center;margin-bottom:28px;">
            <a href="{verify_url}"
               style="display:inline-block;background:linear-gradient(135deg,#C0392B,#E67E22);color:#fff;text-decoration:none;padding:16px 40px;border-radius:50px;font-weight:700;font-size:15px;box-shadow:0 8px 24px rgba(192,57,43,.3);">
              ✅ Confirmar reserva
            </a>
          </div>

          <p style="color:#8B7355;font-size:13px;line-height:1.6;">
            Si no has realizado esta reserva, ignora este email. El enlace expirará automáticamente.<br><br>
            ¿Necesitas ayuda? Escríbenos a
            <a href="mailto:hola@hotelrural.es" style="color:#E67E22;">hola@hotelrural.es</a>
          </p>
        </div>

        <!-- Footer -->
        <div style="background:#2C1810;padding:20px 32px;text-align:center;">
          <p style="color:rgba(255,255,255,.4);font-size:12px;margin:0;">
            © Hotel Rural · Rascafría, Madrid · <a href="{FRONTEND_URL}" style="color:#E67E22;text-decoration:none;">hotelrural.es</a>
          </p>
        </div>
      </div>
    </body>
    </html>
    """

    service = _get_gmail_service()
    if service:
        _send(service, reservation.guest_email, "Confirma tu reserva — Hotel Rural", html)
    else:
        logger.info("DEV — Verification email would go to %s\nURL: %s", reservation.guest_email, verify_url)


def send_confirmation_email(reservation):
    nights = (reservation.check_out - reservation.check_in).days
    html = f"""
    <!DOCTYPE html>
    <html lang="es">
    <body style="margin:0;padding:0;background:#FDF6F0;font-family:'Segoe UI',Arial,sans-serif;">
      <div style="max-width:580px;margin:40px auto;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.08);">
        <div style="background:linear-gradient(135deg,#27AE60,#2ECC71);padding:40px 32px;text-align:center;">
          <span style="font-size:48px;">🎉</span>
          <h1 style="margin:12px 0 0;color:#fff;font-size:26px;font-weight:700;">¡Reserva confirmada!</h1>
        </div>
        <div style="padding:36px 32px;">
          <p style="color:#8B7355;line-height:1.6;margin-bottom:24px;">
            Tu reserva en <strong>{reservation.apartment.name}</strong> está confirmada.
            ¡Nos vemos pronto!
          </p>
          <div style="background:#FDF6F0;border-radius:16px;padding:20px;margin-bottom:28px;">
            <p style="margin:0 0 8px;font-weight:700;color:#2C1810;">Detalles de tu estancia</p>
            <p style="margin:4px 0;color:#8B7355;font-size:14px;">📅 {reservation.check_in.strftime('%d/%m/%Y')} → {reservation.check_out.strftime('%d/%m/%Y')} ({nights} noches)</p>
            <p style="margin:4px 0;color:#8B7355;font-size:14px;">🏠 {reservation.apartment.name}</p>
            <p style="margin:4px 0;color:#E67E22;font-size:14px;font-weight:700;">💰 Total: {reservation.total_price}€</p>
          </div>
          <p style="color:#8B7355;font-size:13px;">
            Si tienes alguna duda, contáctanos en
            <a href="mailto:hola@hotelrural.es" style="color:#E67E22;">hola@hotelrural.es</a>
            o llámanos al <a href="tel:+34918123456" style="color:#E67E22;">+34 918 123 456</a>
          </p>
        </div>
        <div style="background:#2C1810;padding:20px 32px;text-align:center;">
          <p style="color:rgba(255,255,255,.4);font-size:12px;margin:0;">Hotel Rural · Rascafría, Madrid</p>
        </div>
      </div>
    </body>
    </html>
    """

    service = _get_gmail_service()
    if service:
        _send(service, reservation.guest_email, "¡Reserva confirmada! — Hotel Rural", html)
    else:
        logger.info("DEV — Confirmation email would go to %s", reservation.guest_email)


def send_contact_notification(data: dict):
    html = f"""
    <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px;">
      <h2 style="color:#C0392B;">Nuevo mensaje de contacto</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#666;font-size:14px;">Nombre</td>
            <td style="padding:6px 0;font-weight:600;">{data.get('name')}</td></tr>
        <tr><td style="padding:6px 0;color:#666;font-size:14px;">Email</td>
            <td style="padding:6px 0;font-weight:600;">{data.get('email')}</td></tr>
        <tr><td style="padding:6px 0;color:#666;font-size:14px;">Asunto</td>
            <td style="padding:6px 0;font-weight:600;">{data.get('subject')}</td></tr>
      </table>
      <div style="background:#f9f9f9;border-radius:8px;padding:16px;margin-top:16px;">
        <p style="margin:0;color:#333;line-height:1.6;">{data.get('message')}</p>
      </div>
    </div>
    """

    service = _get_gmail_service()
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@hotelrural.es")
    if service:
        _send(service, admin_email, f"Contacto: {data.get('subject')}", html)
    else:
        logger.info("DEV — Contact message from %s", data.get("email"))
