import React from 'react';
import type { SpaceScale } from '@shopify/polaris-tokens';
import type { ResponsiveProp } from '../../utilities/css';
import type { Error } from '../../types';
type Spacing = ResponsiveProp<SpaceScale>;
export interface ChoiceBleedProps {
    /** Spacing around children. Accepts a spacing token or an object of spacing tokens for different screen sizes.
     * @example
     * bleed='4'
     * bleed={{xs: '2', sm: '3', md: '4', lg: '5', xl: '6'}}
     */
    bleed?: Spacing;
    /** Vertical start spacing around children. Accepts a spacing token or an object of spacing tokens for different screen sizes.
     * @example
     * bleedBlockStart='4'
     * bleedBlockStart={{xs: '2', sm: '3', md: '4', lg: '5', xl: '6'}}
     */
    bleedBlockStart?: Spacing;
    /** Vertical end spacing around children. Accepts a spacing token or an object of spacing tokens for different screen sizes.
     * @example
     * bleedBlockEnd='4'
     * bleedBlockEnd={{xs: '2', sm: '3', md: '4', lg: '5', xl: '6'}}
     */
    bleedBlockEnd?: Spacing;
    /** Horizontal start spacing around children. Accepts a spacing token or an object of spacing tokens for different screen sizes.
     * @example
     * bleedInlineStart='4'
     * bleedInlineStart={{xs: '2', sm: '3', md: '4', lg: '5', xl: '6'}}
     */
    bleedInlineStart?: Spacing;
    /** Horizontal end spacing around children. Accepts a spacing token or an object of spacing tokens for different screen sizes.
     * @example
     * bleedInlineEnd='4'
     * bleedInlineEnd={{xs: '2', sm: '3', md: '4', lg: '5', xl: '6'}}
     */
    bleedInlineEnd?: Spacing;
}
interface ChoiceProps extends ChoiceBleedProps {
    /** A unique identifier for the choice */
    id: string;
    /**	Label for the choice */
    label: React.ReactNode;
    /** Whether the associated form control is disabled */
    disabled?: boolean;
    /** Visually hide the label */
    labelHidden?: boolean;
    /**  Content to display inside the choice */
    children?: React.ReactNode;
    /** Callback when clicked */
    onClick?(): void;
    /** Added to the label element */
    labelClassName?: string;
    /** Grow to fill the space. Equivalent to width: 100%; height: 100% */
    fill?: ResponsiveProp<boolean>;
    /** Display an error message */
    error?: Error | boolean;
    /** Additional text to aide in use. Will add a wrapping <div> */
    helpText?: React.ReactNode;
}
export declare function Choice({ id, label, disabled, error, children, labelHidden, helpText, onClick, labelClassName, fill, bleed, bleedBlockStart, bleedBlockEnd, bleedInlineStart, bleedInlineEnd, }: ChoiceProps): React.JSX.Element;
export declare function helpTextID(id: string): string;
export {};
//# sourceMappingURL=Choice.d.ts.map