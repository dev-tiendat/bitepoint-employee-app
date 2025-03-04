export type OnPressNone = () => void;

export type OnPressNoneReturnPromise = () => Promise<void>;

export type OnPressString = (value: string) => void;

export type OnGenericPress<T> = (value: T) => void;