export default class TextUtils {
  static nonAccentVietnamese(text: string) {
    text = text.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, 'A');
    text = text.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    text = text.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, 'E');
    text = text.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    text = text.replace(/I|Í|Ì|Ĩ|Ị/g, 'I');
    text = text.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    text = text.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, 'O');
    text = text.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    text = text.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, 'U');
    text = text.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    text = text.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, 'Y');
    text = text.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    text = text.replace(/Đ/g, 'D');
    text = text.replace(/đ/g, 'd');
    text = text.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '');
    text = text.replace(/\u02C6|\u0306|\u031B/g, '');
    return text;
  }
}
