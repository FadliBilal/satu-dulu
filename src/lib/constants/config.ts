import { Occupation } from "../types";

export const OCCUPATION_OPTIONS: Array<{ value: Occupation; label: string }> = [
  { value: "student", label: "Mahasiswa / Pelajar" },
  { value: "developer", label: "Software Developer / Engineer" },
  { value: "designer", label: "Desainer Grafis / UI/UX" },
  { value: "marketer", label: "Pemasar / Content Creator" },
  { value: "freelancer", label: "Pekerja Lepas (Freelancer)" },
  { value: "entrepreneur", label: "Wirausahawan / Founder" },
  { value: "employee", label: "Pekerja Pengetahuan / Karyawan" },
  { value: "other", label: "Lainnya" },
];

export const TIMEZONE_OPTIONS: string[] = [
  "Asia/Jakarta",
  "Asia/Makassar",
  "Asia/Jayapura",
  "Asia/Singapore",
  "Asia/Tokyo",
  "UTC",
  "Europe/London",
  "Europe/Berlin",
  "America/New_York",
  "America/Los_Angeles",
];

export const APP_CONFIG = {
  appName: "SatuDulu",
  tagline: "Satu hal dalam satu waktu",
  defaultTimezone: "Asia/Jakarta",
  maxDailyCommitments: 5,
  storageKeys: {
    theme: "satudulu_theme",
    geminiKey: "satudulu_gemini_key",
    guestMode: "satudulu_guest_mode",
    localData: "satudulu_data_v2",
  },
} as const;
