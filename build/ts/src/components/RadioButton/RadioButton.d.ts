import React from 'react';
import type { ResponsiveProp } from '../../utilities/css';
import type { ChoiceBleedProps } from '../Choice';
export interface RadioButtonProps extends ChoiceBleedProps {
    /** Indicates the ID of the element that describes the the radio button */
    ariaDescribedBy?: string;
    /** Label for the radio button */
    label: React.ReactNode;
    /** Visually hide the label */
    labelHidden?: boolean;
    /** Radio button is selected */
    checked?: boolean;
    /** Disable input */
    disabled?: boolean;
    /** ID for form input */
    id?: string;
    /** Name for form input */
    name?: string;
    /** Value for form input */
    value?: string;
    /** Callback when the radio button is toggled */
    onChange?(newValue: boolean, id: string): void;
    /** Callback when radio button is focused */
    onFocus?(): void;
    /** Callback when focus is removed */
    onBlur?(): void;
    /** Grow to fill the space. Equivalent to width: 100%; height: 100% */
    fill?: ResponsiveProp<boolean>;
    /** Additional text to aide in use */
    helpText?: React.ReactNode;
}
export declare function RadioButton({ ariaDescribedBy: ariaDescribedByProp, label, labelHidden, helpText, checked, disabled, onChange, onFocus, onBlur, id: idProp, name: nameProp, value, fill, bleed, bleedBlockStart, bleedBlockEnd, bleedInlineStart, bleedInlineEnd, }: RadioButtonProps): React.JSX.Element;
//# sourceMappingURL=RadioButton.d.ts.map