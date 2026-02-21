import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export const DATE_DISPLAY_FORMAT = "DD-MM-YYYY";

const parseDateValue = (value) => {
  if (!value) {
    return null;
  }

  if (dayjs.isDayjs(value)) {
    return value;
  }

  return dayjs(value, [DATE_DISPLAY_FORMAT, "YYYY-MM-DD", dayjs.ISO_8601], true);
};

export const formatDate = (value, fallback = "N/A") => {
  const parsedDate = parseDateValue(value);
  return parsedDate?.isValid() ? parsedDate.format(DATE_DISPLAY_FORMAT) : fallback;
};

export const formatDateTime = (value, fallback = "N/A") => {
  const parsedDate = parseDateValue(value);
  return parsedDate?.isValid()
    ? `${parsedDate.format(DATE_DISPLAY_FORMAT)} ${parsedDate.format("HH:mm")}`
    : fallback;
};

export const toDayjsDate = (value) => {
  const parsedDate = parseDateValue(value);
  return parsedDate?.isValid() ? parsedDate : null;
};