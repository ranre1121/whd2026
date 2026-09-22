import { env } from 'cloudflare:workers';
import { eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { participant } from '@/db/schema';

interface AppEnv {
  DB: D1Database;
}

function getAppDb() {
  return getDb((env as unknown as AppEnv).DB);
}

export type ReportParticipant = {
  id: string;
  fullName: string;
  email: string;
  iin: string;
  phone: string;
  city: string;
  placeOfStudy: string;
  parentPhone: string | null;
  educationLevel: string;
  teamName: string | null;
  attended: boolean;
  createdAt: string;
};

export type ReportTeam = {
  name: string;
  inviteSlug: string;
  captainName: string;
  memberCount: number;
  /** A team only competes once it reaches MIN_TEAM_SIZE. */
  eligible: boolean;
  members: string[];
  createdAt: string;
};

export type ReportStats = {
  participants: number;
  teams: number;
  eligibleTeams: number;
  teamless: number;
  attended: number;
};

const toIso = (v: Date | number) => (v instanceof Date ? v : new Date(v)).toISOString();

export async function getReportData(): Promise<{
  participants: ReportParticipant[];
  teams: ReportTeam[];
  stats: ReportStats;
}> {
  const db = getAppDb();
  const { MIN_TEAM_SIZE } = await import('@/db/schema');

  const participantRows = await db.query.participant.findMany({
    with: {
      user: { columns: { email: true } },
      team: { columns: { name: true } },
    },
  });

  const participants: ReportParticipant[] = participantRows.map((p) => ({
    id: p.id,
    fullName: p.fullName,
    email: p.user?.email ?? '',
    iin: p.iin,
    phone: p.phone,
    city: p.city,
    placeOfStudy: p.placeOfStudy,
    parentPhone: p.parentPhone,
    educationLevel: p.educationLevel,
    teamName: p.team?.name ?? null,
    attended: p.attended,
    createdAt: toIso(p.createdAt),
  }));

  const teamRows = await db.query.team.findMany({
    with: {
      captain: { columns: { fullName: true } },
      members: { columns: { id: true, fullName: true } },
    },
  });

  const teams: ReportTeam[] = teamRows.map((t) => {
    // Captain first, then everyone else, so the roster reads predictably.
    const ordered = [
      ...t.members.filter((m) => m.id === t.captainId),
      ...t.members.filter((m) => m.id !== t.captainId),
    ];
    return {
      name: t.name,
      inviteSlug: t.inviteSlug,
      captainName: t.captain?.fullName ?? '',
      memberCount: t.members.length,
      eligible: t.members.length >= MIN_TEAM_SIZE,
      members: ordered.map((m) => m.fullName),
      createdAt: toIso(t.createdAt),
    };
  });

  return {
    participants,
    teams,
    stats: {
      participants: participants.length,
      teams: teams.length,
      eligibleTeams: teams.filter((t) => t.eligible).length,
      teamless: participants.filter((p) => !p.teamName).length,
      attended: participants.filter((p) => p.attended).length,
    },
  };
}

/** Mark a participant present or absent at the venue. */
export async function setAttendance(userId: string, attended: boolean): Promise<void> {
  const db = getAppDb();
  await db
    .update(participant)
    .set({ attended, updatedAt: new Date() })
    .where(eq(participant.id, userId));
}

/** Rows as CSV, for organisers who want the data in a spreadsheet. */
export function participantsToCsv(rows: ReportParticipant[]): string {
  const headers = [
    'Full name',
    'Email',
    'IIN',
    'Phone',
    'City',
    'Place of study',
    'Parent phone',
    'Education level',
    'Team',
    'Attended',
    'Registered at',
  ];
  const escape = (v: string | null | boolean) => {
    const s = v === null ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = rows.map((r) =>
    [
      r.fullName,
      r.email,
      r.iin,
      r.phone,
      r.city,
      r.placeOfStudy,
      r.parentPhone,
      r.educationLevel,
      r.teamName,
      r.attended ? 'yes' : 'no',
      r.createdAt,
    ]
      .map(escape)
      .join(','),
  );
  return [headers.join(','), ...lines].join('\n');
}
