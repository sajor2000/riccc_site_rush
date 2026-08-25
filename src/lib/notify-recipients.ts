/**
 * Recipients for public form notifications (contact + internship).
 * Override with comma-separated NOTIFY_EMAILS in the environment.
 * Owner Gmail is listed first so internship applications always reach juancroj@gmail.com.
 */
const DEFAULT_NOTIFY_EMAILS = [
  "juancroj@gmail.com",
  "juan_rojas@rush.edu",
  "Kevin_Buell@rush.edu",
] as const;

export function getNotifyRecipients(): string[] {
  const fromEnv = process.env.NOTIFY_EMAILS?.split(",")
    .map((e) => e.trim())
    .filter(Boolean);
  if (fromEnv && fromEnv.length > 0) return fromEnv;
  return [...DEFAULT_NOTIFY_EMAILS];
}
