import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { colors, spacing, typography, borderRadius } from '@/constants/design';

interface AutoExpandingTextAreaProps extends Omit<TextInputProps, 'multiline'> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  minHeight?: number;
  maxHeight?: number;
}

export default function AutoExpandingTextArea({
  label,
  error,
  leftIcon,
  rightIcon,
  style,
  minHeight = 50,
  maxHeight = 200,
  value,
  onChangeText,
  ...props
}: AutoExpandingTextAreaProps) {
  const [textInputHeight, setTextInputHeight] = useState(minHeight);
  const [isInitialized, setIsInitialized] = useState(false);
  const textInputRef = useRef<TextInput>(null);

  const handleContentSizeChange = (event: any) => {
    const { height } = event.nativeEvent.contentSize;
    
    // Ensure minimum height and maximum height constraints
    const newHeight = Math.max(minHeight, Math.min(height, maxHeight));
    setTextInputHeight(newHeight);
    
    // Set initialized flag after first content size change
    if (!isInitialized) {
      setIsInitialized(true);
    }
  };

  const handleLayoutChange = (event: any) => {
    // For multiline inputs, we don't need to handle layout change for height
    // Content size change will handle the height adjustment
    // This is just for initialization if needed
  };

  // Reset height when value changes (for clearing the input)
  useEffect(() => {
    if (!value) {
      setTextInputHeight(minHeight);
      setIsInitialized(false);
    }
  }, [value, minHeight]);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, error && styles.inputError, { minHeight }]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          ref={textInputRef}
          style={[styles.input, style, { height: textInputHeight }]}
          multiline
          placeholderTextColor={colors.textLight}
          value={value}
          onChangeText={onChangeText}
          onContentSizeChange={handleContentSizeChange}
          onLayout={handleLayoutChange}
          {...props}
        />
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Changed from center to support multiline
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  inputError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    paddingVertical: 0, // Removed default padding since we're using container padding
    textAlignVertical: 'top', // Ensure text starts from top for multiline
  },
  leftIcon: {
    marginRight: spacing.sm,
    marginTop: spacing.xs, // Align icon with text baseline
  },
  rightIcon: {
    marginLeft: spacing.sm,
    marginTop: spacing.xs, // Align icon with text baseline
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
});