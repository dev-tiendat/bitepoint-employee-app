import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCAL_STORAGE_PREFIX = 'vn.bitepoint.EmployeeApp';

class StorageUtils {
  static getItem = (key: string): Promise<string | null> =>
    AsyncStorage.getItem(`${LOCAL_STORAGE_PREFIX}.${key}`);

  static setItem = (key: string, value: string): Promise<void> =>
    AsyncStorage.setItem(`${LOCAL_STORAGE_PREFIX}.${key}`, value);

  static removeItem = (key: string): Promise<void> =>
    AsyncStorage.removeItem(`${LOCAL_STORAGE_PREFIX}.${key}`);

  static getInteger = async (key: string): Promise<number | null> => {
    const value = await StorageUtils.getItem(key);
    return value !== null ? parseInt(value, 10) : null;
  };

  static getFloat = async (key: string): Promise<number | null> => {
    const value = await StorageUtils.getItem(key);
    return value !== null ? parseFloat(value) : null;
  };

  static setNumber = (key: string, value: number): Promise<void> =>
    StorageUtils.setItem(key, value.toString());

  static getBoolean = async (key: string): Promise<boolean> => {
    const value = await StorageUtils.getItem(key);
    return value !== null && value === 'true';
  };

  static setBoolean = (key: string, value: boolean): Promise<void> =>
    StorageUtils.setItem(key, value.toString());

  static getJson = async (key: string): Promise<any | null> => {
    const value = await StorageUtils.getItem(key);
    try {
      return value !== null ? JSON.parse(value) : value;
    } catch (error) {
      return value;
    }
  };

  static setJson = (key: string, value: unknown): Promise<void> =>
    StorageUtils.setItem(key, JSON.stringify(value));
}

export default StorageUtils;
