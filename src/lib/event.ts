/**
 * Single source of truth for everything that changes from one edition to the
 * next. Dates and copy live in the locale files; only links and machine-read
 * values belong here.
 */

/** Registration form — the destination of every "Register" CTA on the page. */
export const REGISTRATION_URL = 'https://forms.gle/4A8GVRFzDLKdru9JA';

/** Deadline the hero countdown runs down to (local time). */
export const REGISTRATION_DEADLINE = new Date('2025-10-22T23:59:00');

export const VENUE_MAP_URL = 'https://maps.google.com/?q=Nazarbayev+University';

export const CONTACT_EMAIL = 'acm_w@nu.edu.kz';

export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/nuacm_wsc/',
  telegram: 'https://t.me/nu_acm_w',
  tiktok: 'https://www.tiktok.com/@nuacmsc',
  email: `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}&su=&body=`,
} as const;

/** Participant chat — used by the FAQ answers. */
export const TELEGRAM_CHAT_URL = 'https://t.me/WHD_chat';
