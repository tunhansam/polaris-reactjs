import React from 'react';
import type { ResponsiveProp } from '../../utilities/css';
import type { ChoiceBleedProps } from '../Choice';
import type { Error, CheckboxHandles } from '../../types';
export interface CheckboxProps extends ChoiceBleedProps {
    /** Indicates the ID of the element that is controlled by the checkbox */
    ariaControls?: string;
    /** Indicates the ID of the element that describes the checkbox */
    ariaDescribedBy?: string;
    /** Label for the checkbox */
    label: React.ReactNode;
    /** Visually hide the label */
    labelHidden?: boolean;
    /** Checkbox is selected. `indeterminate` shows a horizontal line in the checkbox */
    checked?: boolean | 'indeterminate';
    /** Disable input */
    disabled?: boolean;
    /** ID for form input */
    id?: string;
    /** Name for form input */
    name?: string;
    /** Value for form input */
    value?: string;
    /** Callback when checkbox is toggled */
    onChange?(newChecked: boolean, id: string): void;
    /** Callback when checkbox is focused */
    onFocus?(): void;
    /** Callback when focus is removed */
    onBlur?(): void;
    /** Added to the wrapping label */
    labelClassName?: string;
    /** Grow to fill the space. Equivalent to width: 100%; height: 100% */
    fill?: ResponsiveProp<boolean>;
    /** Additional text to aide in use */
    helpText?: React.ReactNode;
    /** Display an error message */
    error?: Error | boolean;
}
export declare const Checkbox: React.ForwardRefExoticComponent<CheckboxProps & React.RefAttributes<CheckboxHandles>>;
//# sourceMappingURL=Checkbox.d.ts.map