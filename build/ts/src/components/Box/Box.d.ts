import React from 'react';
import type { ColorTextAlias, ColorBackgroundAlias, ColorBorderAlias, BorderWidthScale, BorderRadiusScale, ShadowAlias, SpaceScale } from '@shopify/polaris-tokens';
import type { ResponsiveProp } from '../../utilities/css';
type Element = 'div' | 'span' | 'section' | 'legend' | 'ul' | 'li';
type LineStyles = 'solid' | 'dashed';
type Overflow = 'hidden' | 'scroll';
type Position = 'relative' | 'absolute' | 'fixed' | 'sticky';
type Spacing = ResponsiveProp<SpaceScale>;
export interface BoxProps extends React.AriaAttributes {
    children?: React.ReactNode;
    /** HTML Element type
     * @default 'div'
     */
    as?: Element;
    /** Background color */
    background?: ColorBackgroundAlias;
    /** Border color */
    borderColor?: ColorBorderAlias | 'transparent';
    /** Border style */
    borderStyle?: LineStyles;
    /** Border radius */
    borderRadius?: BorderRadiusScale;
    /** Vertical end horizontal start border radius */
    borderRadiusEndStart?: BorderRadiusScale;
    /** Vertical end horizontal end border radius */
    borderRadiusEndEnd?: BorderRadiusScale;
    /** Vertical start horizontal start border radius */
    borderRadiusStartStart?: BorderRadiusScale;
    /** Vertical start horizontal end border radius */
    borderRadiusStartEnd?: BorderRadiusScale;
    /** Border width */
    borderWidth?: BorderWidthScale;
    /** Vertical start border width */
    borderBlockStartWidth?: BorderWidthScale;
    /** Vertical end border width */
    borderBlockEndWidth?: BorderWidthScale;
    /** Horizontal start border width */
    borderInlineStartWidth?: BorderWidthScale;
    /** Horizontal end border width */
    borderInlineEndWidth?: BorderWidthScale;
    /** Color of children */
    color?: ColorTextAlias;
    /** HTML id attribute */
    id?: string;
    /** Minimum height of container */
    minHeight?: string;
    /** Minimum width of container */
    minWidth?: string;
    /** Maximum width of container */
    maxWidth?: string;
    /** Clip horizontal content of children */
    overflowX?: Overflow;
    /** Clip vertical content of children */
    overflowY?: Overflow;
    /** Spacing around children. Accepts a spacing token or an object of spacing tokens for different screen sizes.
     * @example
     * padding='4'
     * padding={{xs: '2', sm: '3', md: '4', lg: '5', xl: '6'}}
     */
    padding?: Spacing;
    /** Vertical start spacing around children. Accepts a spacing token or an object of spacing tokens for different screen sizes.
     * @example
     * paddingBlockStart='4'
     * paddingBlockStart={{xs: '2', sm: '3', md: '4', lg: '5', xl: '6'}}
     */
    paddingBlockStart?: Spacing;
    /** Vertical end spacing around children. Accepts a spacing token or an object of spacing tokens for different screen sizes.
     * @example
     * paddingBlockEnd='4'
     * paddingBlockEnd={{xs: '2', sm: '3', md: '4', lg: '5', xl: '6'}}
     */
    paddingBlockEnd?: Spacing;
    /** Horizontal start spacing around children. Accepts a spacing token or an object of spacing tokens for different screen sizes.
     * @example
     * paddingInlineStart='4'
     * paddingInlineStart={{xs: '2', sm: '3', md: '4', lg: '5', xl: '6'}}
     */
    paddingInlineStart?: Spacing;
    /** Horizontal end spacing around children. Accepts a spacing token or an object of spacing tokens for different screen sizes.
     * @example
     * paddingInlineEnd='4'
     * paddingInlineEnd={{xs: '2', sm: '3', md: '4', lg: '5', xl: '6'}}
     */
    paddingInlineEnd?: Spacing;
    /** Aria role */
    role?: Extract<React.AriaRole, 'status' | 'presentation' | 'menu' | 'listbox' | 'combobox'>;
    /** Shadow on box */
    shadow?: ShadowAlias;
    /** Set tab order */
    tabIndex?: Extract<React.AllHTMLAttributes<HTMLElement>['tabIndex'], number>;
    /** Width of container */
    width?: string;
    /** Position of box */
    position?: Position;
    /** Top position of box */
    insetBlockStart?: Spacing;
    /** Bottom position of box */
    insetBlockEnd?: Spacing;
    /** Left position of box */
    insetInlineStart?: Spacing;
    /** Right position of box */
    insetInlineEnd?: Spacing;
    /** Opacity of box */
    opacity?: string;
    /** Outline color */
    outlineColor?: ColorBorderAlias;
    /** Outline style */
    outlineStyle?: LineStyles;
    /** Outline width */
    outlineWidth?: BorderWidthScale;
    /** Visually hide the contents during print */
    printHidden?: boolean;
    /** Visually hide the contents (still announced by screenreader) */
    visuallyHidden?: boolean;
    /** z-index of box */
    zIndex?: string;
}
export declare const Box: React.ForwardRefExoticComponent<BoxProps & React.RefAttributes<HTMLElement>>;
export {};
//# sourceMappingURL=Box.d.ts.map