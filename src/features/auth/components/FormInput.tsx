/**
 * Auth Feature - FormInput Component
 * React Hook Form Controller wrapper for Input
 */

import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Input, InputProps } from '@/common/ui';

interface FormInputProps<T extends FieldValues> extends Omit<InputProps, 'value' | 'onChangeText' | 'onBlur'> {
    control: Control<T>;
    name: Path<T>;
}

export function FormInput<T extends FieldValues>({
    control,
    name,
    ...inputProps
}: FormInputProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <Input
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={error?.message}
                    {...inputProps}
                />
            )}
        />
    );
}
