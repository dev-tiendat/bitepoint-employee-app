import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import { OnGenericPress } from 'types/props';
import { COLORS, FONTS, SIZES } from 'common';
import Icon, { IconProps } from './Icon';

export type Item = {
  label: string;
  value: any;
};

type RadioGroupProps = {
  data: Item[];
  value: any;
  label?: string;
  errorMessage?: string;
  icons?: IconProps[];
  formHorizontal?: boolean;
  labelHorizontal?: boolean;
  inputFirst?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<ViewStyle>;
  onPress: OnGenericPress<any>;
};

const RADIO_SELECTED_COLOR = COLORS.secondary600;
const RADIO_UNSELECTED_COLOR = COLORS.netral200;

const RadioGroup: React.FC<RadioGroupProps> = ({
  data,
  value,
  label,
  errorMessage,
  icons,
  formHorizontal = true,
  labelHorizontal = true,
  inputFirst = true,
  style,
  labelStyle,
  onPress,
}) => {
  const renderButtonInput = (
    item: Item,
    index: number,
    isSelected: boolean,
  ) => {
    const buttonColor = isSelected
      ? RADIO_SELECTED_COLOR
      : RADIO_UNSELECTED_COLOR;
    return (
      <RadioButtonInput
        obj={item}
        index={index}
        isSelected={isSelected}
        buttonInnerColor={buttonColor}
        buttonOuterColor={buttonColor}
        buttonSize={8}
        buttonOuterSize={20}
        onPress={onPress}
        buttonWrapStyle={styles.radioButtonInputWrap}
      />
    );
  };

  const getLabelWrapStyle = (): ViewStyle[] => {
    const style1 = labelHorizontal
      ? {
          alignItems: 'center',
        }
      : {
          width: '75%',
          justifyContent: 'center',
        };
    const style2 = inputFirst ? {} : { flex: 1 };
    return [styles.radioButtonLabelWrap, style1 as ViewStyle, style2];
  };

  const renderButtonLabel = (item: Item, index: number) => {
    return (
      <RadioButtonLabel
        labelHorizontal
        obj={item}
        index={index}
        onPress={onPress}
        labelStyle={styles.radioButtonLabel}
        labelWrapStyle={getLabelWrapStyle()}
      />
    );
  };

  const renderButtonIcon = (icon: IconProps) => {
    return <Icon {...icon} />;
  };

  const getRadioButtonStyle = (isSelected: boolean): ViewStyle => ({
    borderWidth: labelHorizontal ? 0 : 1,
    borderColor: labelHorizontal
      ? 'transparent'
      : isSelected
      ? COLORS.warning400
      : COLORS.netral300,
    borderRadius: 2,
    padding: labelHorizontal ? 0 : 5,
  });

  const getRadioButtonWrapStyle = (index: number): ViewStyle => {
    return {
      marginLeft: formHorizontal && index > 0 ? SIZES.padding : 0,
    };
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <RadioForm
        formHorizontal={formHorizontal}
        onPress={onPress}
        animation={true}>
        {data.map((item, index) => {
          const isSelected = value === item.value;
          const icon = icons?.[index];

          return (
            <RadioButton
              key={`${item.label}-${index}`}
              labelHorizontal={labelHorizontal}
              style={getRadioButtonStyle(isSelected)}
              wrapStyle={getRadioButtonWrapStyle(index)}>
              {inputFirst && renderButtonInput(item, index, isSelected)}
              {icon && renderButtonIcon(icon)}
              {renderButtonLabel(item, index)}
              {!inputFirst && renderButtonInput(item, index, isSelected)}
            </RadioButton>
          );
        })}
      </RadioForm>
      <Text style={styles.errorMessage}>{errorMessage}</Text>
    </View>
  );
};
export default RadioGroup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
  },
  label: {
    ...FONTS.title3,
    color: COLORS.netral600,
  },
  radioButtonInputWrap: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonLabel: {
    margin: 0,
    padding: 0,
    textAlign: 'center',
    color: COLORS.primary_dark,
    ...FONTS.body3,
  },
  radioButtonLabelWrap: {
    margin: 0,
    padding: 0,
  },
  errorInput: {
    borderColor: COLORS.danger500,
    borderWidth: 1,
  },
  errorMessage: {
    ...FONTS.subtitle4,
    marginTop: SIZES.base,
    color: COLORS.danger500,
  },
});
