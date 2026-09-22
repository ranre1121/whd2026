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

/** The participant profile for a user, or undefined before onboarding. */
export async function getParticipant(userId: string) {
  const db = getAppDb();
  return db.query.participant.findFirst({ where: eq(participant.id, userId) });
}

/** Create or update a participant profile. Onboarding is re-runnable. */
export async function upsertParticipant(data: {
  userId: string;
  fullName: string;
  iin: string;
  phone: string;
  city: string;
  placeOfStudy: string;
  parentPhone?: string | null;
  educationLevel: string;
  cvUrl?: string | null;
}) {
  const db = getAppDb();

  await db
    .insert(participant)
    .values({
      id: data.userId,
      fullName: data.fullName,
      iin: data.iin,
      phone: data.phone,
      city: data.city,
      placeOfStudy: data.placeOfStudy,
      parentPhone: data.parentPhone ?? null,
      educationLevel: data.educationLevel,
      cvUrl: data.cvUrl ?? null,
    })
    .onConflictDoUpdate({
      target: participant.id,
      set: {
        fullName: data.fullName,
        iin: data.iin,
        phone: data.phone,
        city: data.city,
        placeOfStudy: data.placeOfStudy,
        parentPhone: data.parentPhone ?? null,
        educationLevel: data.educationLevel,
        cvUrl: data.cvUrl ?? null,
        updatedAt: new Date(),
      },
    });
}
