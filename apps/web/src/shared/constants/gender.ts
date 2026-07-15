import i18n from "@/shared/i18n";

/**
 * Canonical gender union shared by patients and contacts. The per-module
 * entity unions (`PatientGender`, contacts' `Gender`) mirror this shape 1:1
 * from the API DTOs — label/options helpers live here so the i18n mapping
 * is written once.
 */
export type Gender = "MALE" | "FEMALE" | "OTHER";

export function getGenderLabel(gender: Gender): string {
  // defaultValue guards against an out-of-enum value (e.g. legacy/seed data)
  // ever rendering the raw key like "gender.Feminino" — fall back to the value.
  return i18n.t(`gender.${gender}`, { ns: "common", defaultValue: gender });
}

export function getGenderOptions(): Array<{ value: Gender; label: string }> {
  const genders: Gender[] = ["MALE", "FEMALE", "OTHER"];
  return genders.map((g) => ({ value: g, label: getGenderLabel(g) }));
}
