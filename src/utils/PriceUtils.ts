import { isNil } from 'lodash';
import numeral from 'numeral';

class PriceUtils {
  private static UNKNOW = 'Chưa xác định';
  private static FREE = 'Miễn phí';

  static getString(price: number): string {
    const isUnknownPrice = isNil(price) || price < 0;
    if (isUnknownPrice) return this.UNKNOW;
    price = Math.floor(price);

    let result = this.isNumber(price)
      ? `${numeral(price).format('0,0')}đ`
      : price.toString();

    return result;
  }

  private static isNumber(text: string | number): boolean {
    return typeof text === 'number' || /^\d+$/.test(text);
  }
}

export default PriceUtils;
