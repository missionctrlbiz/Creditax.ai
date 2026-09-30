'use client';

/**
 * Pro Tax Assistant — the same grounded chat canvas as the personal board,
 * scoped to the pro account (u-pro) via the session resolver inside the
 * canvas. Lives at /pro/dashboard/chat so the pro sidebar "Tax Assistant"
 * resolves within the pro portal (no role-gate bounce) and the live quota
 * line reads the pro's professional tier.
 */
import PersonalChatCanvas from '@/app/[locale]/dashboard/chat/page';

export default function ProChatPage() {
  return <PersonalChatCanvas />;
}
