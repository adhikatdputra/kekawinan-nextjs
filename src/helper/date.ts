import dayjs from "dayjs";
import "dayjs/locale/id";

export const formatDate = (date: string) => {
  return dayjs(date).format("DD MMMM YYYY");
};

export const formatDateWithTime = (date: string) => {
  return dayjs(date).format("DD MMMM YYYY HH:mm");
};

export const formatDateId = (date: string) => {
  return dayjs(date).locale("id").format("dddd, DD MMMM YYYY");
};

export const formatDateIdWithTime = (date: string) => {
  return dayjs(date).locale("id").format("dddd, DD MMMM YYYY HH:mm");
};