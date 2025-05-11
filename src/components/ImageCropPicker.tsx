import {
  ImageProps,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import RNImageCropPicker, {
  ImageOrVideo,
  Options as PickerOptions,
} from 'react-native-image-crop-picker';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { COLORS, FONTS, PROPS, SIZES } from 'common';
import FastImage from 'react-native-fast-image';
import Icon, { IconProps, IconType } from './Icon';
import { isArray, isNil } from 'lodash';

const DEFAULT_IMAGE_SIZE = 150;

enum ImagePickerAction {
  GALLERY = 0,
  CAMERA = 1,
  CANCEL = 2,
}

type ImageCropPickerProps = {
  value: any;
  imageSize: number;
  errorMessage?: string | undefined;
  pickerOptions?: PickerOptions;
  isHorizontal?: boolean;
  canRemove?: boolean;
  addIconProps?: Omit<IconProps, 'size' | 'color'>;
  imageStyle?: StyleProp<ImageProps>;
  placeholderImage?: string;
  onPick?: (image: any, index?: number) => void;
  onRemove?: (index: number) => void;
};

const ImageCropPicker: React.FC<ImageCropPickerProps> = ({
  value,
  errorMessage,
  pickerOptions = {},
  isHorizontal = true,
  canRemove = true,
  addIconProps,
  imageSize = DEFAULT_IMAGE_SIZE,
  imageStyle,
  placeholderImage,
  onPick,
  onRemove,
}) => {
  const { showActionSheetWithOptions } = useActionSheet();
  const sizeStyle = {
    width: imageSize,
    height: imageSize,
  };

  const handlePickImage = async (
    source: 'gallery' | 'camera',
    imageIndex: number,
  ) => {
    try {
      const pickedImage = await (source === 'gallery'
        ? RNImageCropPicker.openPicker(pickerOptions)
        : RNImageCropPicker.openCamera(pickerOptions));

      onPick?.(pickedImage, pickerOptions.multiple ? imageIndex : undefined);
    } catch (error) {}
  };

  const handleActionSheet = (
    selectedIndex: number | undefined,
    imageIndex: number,
  ) => {
    switch (selectedIndex) {
      case ImagePickerAction.GALLERY:
        handlePickImage('gallery', imageIndex);
        break;
      case ImagePickerAction.CAMERA:
        handlePickImage('camera', imageIndex);
        break;
    }
  };

  const showImagePickerOptions = (imageIndex: number) => {
    const options = ['Thư viện ảnh', 'Chụp ảnh mới', 'Quay lại'];
    const cancelButtonIndex = ImagePickerAction.CANCEL;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      optionIndex => handleActionSheet(optionIndex, imageIndex),
    );
  };

  const renderImageItem = (
    image: string | ImageOrVideo | undefined,
    index: number,
  ) => {
    if (isNil(image)) return null;

    return (
      <View
        key={`${(image as ImageOrVideo)?.filename || image}-${index}`}
        style={styles.imageContainer}>
        <TouchableOpacity
          activeOpacity={PROPS.touchable_active_opacity}
          onPress={() => showImagePickerOptions(index)}>
          <FastImage
            source={{
              uri: (image as ImageOrVideo)?.sourceURL || (image as string),
            }}
            style={[
              styles.image,
              sizeStyle,
              imageStyle,
              errorMessage && styles.imageError,
            ]}
          />
        </TouchableOpacity>

        {canRemove && (
          <TouchableOpacity
            activeOpacity={PROPS.touchable_active_opacity}
            style={styles.closeIconContainer}
            onPress={() => onRemove?.(index)}>
            <Icon
              size={20}
              type={IconType.ION}
              name={'close'}
              color={COLORS.netral_white}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderAddButton = () => (
    <TouchableOpacity
      activeOpacity={PROPS.touchable_active_opacity}
      style={styles.buttonAdd}
      onPress={() => showImagePickerOptions(0)}>
      <Icon
        size={imageSize}
        type={IconType.ION}
        name={'add'}
        color={COLORS.primary400}
        {...addIconProps}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {!isArray(value) ? (
        renderImageItem(value || placeholderImage, 0)
      ) : (
        <ScrollView horizontal={isHorizontal} scrollEnabled={isArray(value)}>
          {value?.map(renderImageItem)}
        </ScrollView>
      )}
      {(isNil(value) ||
        (isArray(value) && (pickerOptions?.maxFiles || 0) > value.length)) &&
        renderAddButton()}
      <Text style={styles.errorMessage}>{errorMessage}</Text>
    </View>
  );
};

export default ImageCropPicker;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.netral_white,
    gap: SIZES.base,
  },
  imageContainer: {
    position: 'relative',
    marginRight: SIZES.radius,
  },
  image: {
    width: DEFAULT_IMAGE_SIZE,
    height: DEFAULT_IMAGE_SIZE,
    borderRadius: SIZES.radius,
    borderWidth: 2,
    borderColor: COLORS.secondary500,
  },
  imageError: {
    borderColor: COLORS.danger500,
  },
  closeIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.netral_black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonAdd: {
    borderRadius: 25,
    backgroundColor: COLORS.secondary100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorMessage: {
    ...FONTS.subtitle4,
    color: COLORS.danger500,
  },
});
