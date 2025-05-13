import dayjs from 'dayjs';
import { isDate } from 'lodash';

const DATE_TIME_FORMAT = 'DD/MM/YYYY HH:mm';
const DATE_FORMAT = 'DD/MM/YYYY';
const TIME_FORMAT = 'HH:mm';

class DateUtils {
  static unixToDateTime(unix: number, format = DATE_TIME_FORMAT): string {
    return dayjs.unix(Number(unix)).format(format);
  }

  static format(
    date: string | number | Date | dayjs.Dayjs | null | undefined,
    format: string,
  ) {
    return dayjs(date).format(format);
  }

  static formatToDateTime(
    date: string | number | Date | dayjs.Dayjs | null | undefined = undefined,
  ): string {
    return dayjs(date).format(DATE_TIME_FORMAT);
  }

  static formatToDate(
    date: string | number | Date | dayjs.Dayjs | null | undefined = undefined,
  ): string {
    return dayjs(date).format(DATE_FORMAT);
  }

  static formatToTime(
    time: string | number | Date | dayjs.Dayjs | null | undefined = undefined,
  ): string {
    return dayjs(time).format(TIME_FORMAT);
  }

  static isDateObject(obj: unknown): boolean {
    return isDate(obj) || dayjs.isDayjs(obj);
  }

  static timeAgo(timestamp: string | number | Date): string {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (diff < 60) return `${diff} giây trước`;
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    if (diff < 30 * 86400) return `${Math.floor(diff / 86400)} ngày trước`;

    return time.toLocaleDateString();
  }
}

export default DateUtils;
