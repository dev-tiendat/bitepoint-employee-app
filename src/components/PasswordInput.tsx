import React from 'react';
import FormInput, { FormInputProps } from './FormInput';
import { IconType } from './Icon';

type PasswordInputProps = Omit<FormInputProps, 'secureTextEntry'>;

const PasswordInput: React.FC<PasswordInputProps> = props => {
  const [showPassword, setShowPassword] = React.useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <FormInput
      {...props}
      appendIcon={{
        type: IconType.ION,
        name: !showPassword ? 'eye' : 'eye-off',
      }}
      secureTextEntry={!showPassword}
      onPressAppendIcon={toggleShowPassword}
    />
  );
};

export default PasswordInput;
