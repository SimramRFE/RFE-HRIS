export const INTERNATIONAL_PHONE_REGEX = /^\+\d{7,15}$/;
export const PHONE_DIGITS_REGEX = /^\d{7,15}$/;

export const PHONE_VALIDATION_RULE = {
  pattern: PHONE_DIGITS_REGEX,
  message: "Enter digits only (7-15). '+' is added automatically.",
};

export const COUNTRY_CODE_VALIDATION_RULE = {
  pattern: /^\d{1,4}$/,
  message: "Enter country code digits only (1-4)",
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

export const combinePhoneNumber = (countryCode, contactNumber) => {
  const contactDigits = typeof contactNumber === "string"
    ? contactNumber.replace(/\D/g, "")
    : "";

  if (!contactDigits) {
    return undefined;
  }

  const countryCodeDigits = typeof countryCode === "string"
    ? countryCode.replace(/\D/g, "")
    : "";

  return `+${countryCodeDigits}${contactDigits}`;
};

export const toPhoneFormParts = (value) => {
  const normalized = normalizePhoneNumber(value);

  if (typeof normalized !== "string") {
    return { countryCode: "", contactNumber: "" };
  }

  const digits = normalized.replace(/^\+/, "");
  if (!digits) {
    return { countryCode: "", contactNumber: "" };
  }

  const countryCodeLength = digits.length > 3 ? 3 : 0;
  const countryCode = countryCodeLength ? digits.slice(0, countryCodeLength) : "";
  const contactNumber = countryCodeLength ? digits.slice(countryCodeLength) : digits;

  return { countryCode, contactNumber };
};

export const formatPhoneNumber = (value, fallback = "N/A") => {
  if (!value) {
    return fallback;
  }

  const normalized = normalizePhoneNumber(value);
  return typeof normalized === "string" ? normalized : fallback;
};

export const splitPhoneNumber = (value) => {
  const normalized = normalizePhoneNumber(value);

  if (typeof normalized !== "string" || !normalized.startsWith("+")) {
    return { countryCode: "", number: normalized || "" };
  }

  const digits = normalized.slice(1);
  if (!digits) {
    return { countryCode: "", number: "" };
  }

  const countryCodeDigits = digits.length > 3 ? digits.slice(0, 3) : digits;
  const numberDigits = digits.length > 3 ? digits.slice(3) : "";

  return {
    countryCode: `+${countryCodeDigits}`,
    number: numberDigits,
  };
};