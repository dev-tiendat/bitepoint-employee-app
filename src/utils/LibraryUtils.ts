import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import isToday from 'dayjs/plugin/isToday';
import numeral from 'numeral';
import { LocaleConfig } from 'react-native-calendars';

const VI_LOCALE = 'vi';
const TIMEZONE = 'Asia/Ho_Chi_Minh';

const VI_CALENDAR_CONFIG = {
  monthNames: Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`),
  monthNamesShort: Array.from({ length: 12 }, (_, i) => `Th${i + 1}`),
  dayNames: [
    'Chủ Nhật',
    'Thứ Hai',
    'Thứ Ba',
    'Thứ Tư',
    'Thứ Năm',
    'Thứ Sáu',
    'Thứ Bảy',
  ],
  dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  today: 'Hôm nay',
};

class LibraryUtils {
  static initialize = () => {
    dayjs.locale(VI_LOCALE);
    [timezone, isToday].forEach(plugin => dayjs.extend(plugin));
    dayjs.tz.setDefault(TIMEZONE);

    if (!numeral.locales[VI_LOCALE]) {
      require('numeral/locales/vi');
    }
    numeral.locale(VI_LOCALE);

    LocaleConfig.locales[VI_LOCALE] = VI_CALENDAR_CONFIG;
    LocaleConfig.defaultLocale = VI_LOCALE;
  };
}

export default LibraryUtils;
