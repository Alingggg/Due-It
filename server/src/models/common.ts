const TIME_OF_DAY = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

// BSON has no time-of-day type, so times are stored as "HH:MM:SS" strings
// (same format Postgres returned); accepts "HH:MM" or "HH:MM:SS"
export const timeOfDay = {
  type: String,
  required: true,
  match: TIME_OF_DAY,
  set: (value: string) => (value.length === 5 ? `${value}:00` : value),
} as const;
