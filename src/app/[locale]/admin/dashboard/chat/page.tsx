'use client';

/**
 * Admin Tax Assistant — the shared grounded chat canvas scoped to the admin
 * account (u-admin) via the session resolver. Lives at /admin/dashboard/chat
 * so the admin sidebar "Tax Assistant" resolves inside the admin board.
 */
import PersonalChatCanvas from '@/app/[locale]/dashboard/chat/page';

export default function AdminChatPage() {
  return <PersonalChatCanvas />;
}
