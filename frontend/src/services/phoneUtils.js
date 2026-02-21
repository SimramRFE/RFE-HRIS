export const INTERNATIONAL_PHONE_REGEX = /^\+\d{7,15}$/;
export const PHONE_DIGITS_REGEX = /^\d{7,15}$/;

export const PHONE_VALIDATION_RULE = {
  pattern: PHONE_DIGITS_REGEX,
  message: "Enter digits only (7-15). '+' is added automatically.",
};

export const PHONE_INPUT_PROPS = {
  prefix: "+",
  maxLength: 15,
};

export const normalizePhoneNumber = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  const cleaned = value.trim().replace(/[\s-]/g, "");
  const digits = cleaned.replace(/^\+/, "");

  if (!digits) {
    return undefined;
  }

  if (/^\d+$/.test(digits)) {
    return `+${digits}`;
  }

  return cleaned;
};

export const toPhoneInputValue = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  return value.trim().replace(/^[+\s]+/, "");
};

export const formatPhoneNumber = (value, fallback = "N/A") => {
  if (!value) {
    return fallback;
  }

  const normalized = normalizePhoneNumber(value);
  return typeof normalized === "string" ? normalized : fallback;
};