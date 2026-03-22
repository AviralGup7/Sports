export class ActionValidationError extends Error {}

function fail(message: string): never {
  throw new ActionValidationError(message);
}

export function getRequiredString(formData: FormData, field: string, label: string) {
  const raw = formData.get(field);
  const value = typeof raw === "string" ? raw.trim() : "";

  if (!value) {
    fail(`${label} is required.`);
  }

  return value;
}

export function getOptionalString(formData: FormData, field: string) {
  const raw = formData.get(field);
  if (typeof raw !== "string") {
    return null;
  }

  const value = raw.trim();
  return value.length > 0 ? value : null;
}

export function getBooleanField(formData: FormData, field: string) {
  return formData.get(field) === "on";
}

export function getNumberField(formData: FormData, field: string, label: string, options?: { min?: number; optional?: boolean }) {
  const raw = formData.get(field);
  const value = typeof raw === "string" ? raw.trim() : "";

  if (!value) {
    if (options?.optional) {
      return null;
    }

    fail(`${label} is required.`);
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    fail(`${label} must be a valid number.`);
  }

  if (typeof options?.min === "number" && parsed < options.min) {
    fail(`${label} must be at least ${options.min}.`);
  }

  return parsed;
}

export function getEnumField<T extends string>(formData: FormData, field: string, values: readonly T[], label: string, fallback?: T): T {
  const raw = typeof formData.get(field) === "string" ? String(formData.get(field)).trim() : "";
  const value = (raw || fallback) as T | undefined;

  if (!value || !values.includes(value)) {
    fail(`${label} is invalid.`);
  }

  return value;
}

export function getStringList(formData: FormData, field: string) {
  return formData
    .getAll(field)
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter(Boolean);
}
