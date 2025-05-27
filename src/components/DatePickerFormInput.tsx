import React, { useMemo, useState } from 'react';
import DatePicker from 'react-native-date-picker';

import { COLORS } from 'common';
import DateUtils from 'utils/DateUtils';
import { IconType } from './Icon';
import FormInput, { FormInputProps } from './FormInput';

type DatePickerFormInputProps = Omit<FormInputProps, 'value'> & {
  value: Date;
  mode?: 'time' | 'date' | 'datetime' | undefined;
  onChange?: (date: Date) => void;
};

const DatePickerFormInput: React.FC<DatePickerFormInputProps> = ({
  value,
  mode,
  onChange,
  ...rest
}) => {
  const dateText = useMemo(() => {
    if (mode === 'time') {
      return DateUtils.formatToTime(value);
    }
    if (mode === 'date') {
      return DateUtils.formatToDate(value);
    }
    return DateUtils.formatToDateTime(value);
  }, [value]);
  const title = useMemo(() => {
    if (mode === 'time') {
      return 'Chọn giờ';
    }
    if (mode === 'date') {
      return 'Chọn ngày';
    }
    return 'Chọn ngày và giờ';
  }, [mode]);
  const [open, setOpen] = useState(false);

  const handlePressAppendIcon = () => {
    setOpen(!open);
  };

  const handleConfirm = (date: Date) => {
    onChange?.(date);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <FormInput
        {...rest}
        value={dateText}
        editable={false}
        appendIcon={{ type: IconType.ION, name: 'calendar-outline' }}
        onPressAppendIcon={handlePressAppendIcon}
      />
      <DatePicker
        date={value}
        open={open}
        modal
        mode={mode}
        locale="vi"
        theme="light"
        confirmText="Xác nhận"
        dividerColor={COLORS.primary600}
        buttonColor={COLORS.primary600}
        title={title}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
};

export default DatePickerFormInput;
