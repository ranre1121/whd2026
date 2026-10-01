import { describe, expect, it } from 'vitest';
import { createTeamSchema, inviteSlugSchema, onboardingSchema } from '@/lib/validation';

const base = {
  fullName: 'Aruzhan Sadykova',
  iin: '050919501086',
  phone: '+7 700 123 45 67',
  city: 'Astana',
  placeOfStudy: 'NIS',
  educationLevel: "Bachelor's",
};

describe('onboardingSchema', () => {
  it('accepts a university student without a parent phone', () => {
    expect(onboardingSchema.safeParse(base).success).toBe(true);
  });

  it('requires a parent phone for school students', () => {
    const result = onboardingSchema.safeParse({ ...base, educationLevel: 'School' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(['parentPhone']);
  });

  it('stores phone numbers as digits only', () => {
    const result = onboardingSchema.parse(base);
    expect(result.phone).toBe('77001234567');
  });
});

describe('team schemas', () => {
  it('bounds team names to 3–30 characters', () => {
    expect(createTeamSchema.safeParse({ name: 'ab' }).success).toBe(false);
    expect(createTeamSchema.safeParse({ name: 'x'.repeat(31) }).success).toBe(false);
    expect(createTeamSchema.safeParse({ name: 'Binary Blossoms' }).success).toBe(true);
  });

  it('only accepts slug-shaped invite codes', () => {
    expect(inviteSlugSchema.safeParse({ slug: 'binary-blossoms' }).success).toBe(true);
    expect(inviteSlugSchema.safeParse({ slug: 'Binary Blossoms' }).success).toBe(false);
  });
});
