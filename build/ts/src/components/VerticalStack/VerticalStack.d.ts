import React from 'react';
import type { SpaceScale } from '@shopify/polaris-tokens';
import type { ResponsiveProp } from '../../utilities/css';
type Align = 'start' | 'center' | 'end' | 'space-around' | 'space-between' | 'space-evenly';
type InlineAlign = 'start' | 'center' | 'end' | 'baseline' | 'stretch';
type Element = 'div' | 'ul' | 'ol' | 'fieldset';
type Gap = ResponsiveProp<SpaceScale>;
export interface VerticalStackProps extends React.AriaAttributes {
    children?: React.ReactNode;
    /** HTML Element type
     * @default 'div'
     */
    as?: Element;
    /** Vertical alignment of children */
    align?: Align;
    /** Horizontal alignment of children */
    inlineAlign?: InlineAlign;
    /** The spacing between children */
    gap?: Gap;
    /** HTML id attribute */
    id?: string;
    /** Reverse the render order of child items
     * @default false
     */
    reverseOrder?: boolean;
    /** Aria role */
    role?: Extract<React.AriaRole, 'status' | 'presentation' | 'menu' | 'listbox' | 'combobox'>;
}
export declare const VerticalStack: ({ as, children, align, inlineAlign, gap, id, reverseOrder, ...restProps }: VerticalStackProps) => React.DetailedReactHTMLElement<{
    /** Aria role */
    role?: "menu" | "combobox" | "listbox" | "presentation" | "status" | undefined;
    'aria-activedescendant'?: string | undefined;
    'aria-atomic'?: (boolean | "true" | "false") | undefined;
    'aria-autocomplete'?: "list" | "none" | "inline" | "both" | undefined;
    'aria-braillelabel'?: string | undefined;
    'aria-brailleroledescription'?: string | undefined;
    'aria-busy'?: (boolean | "true" | "false") | undefined;
    'aria-checked'?: boolean | "true" | "false" | "mixed" | undefined;
    'aria-colcount'?: number | undefined;
    'aria-colindex'?: number | undefined;
    'aria-colindextext'?: string | undefined;
    'aria-colspan'?: number | undefined;
    'aria-controls'?: string | undefined;
    'aria-current'?: boolean | "step" | "time" | "true" | "false" | "page" | "location" | "date" | undefined;
    'aria-describedby'?: string | undefined;
    'aria-description'?: string | undefined;
    'aria-details'?: string | undefined;
    'aria-disabled'?: (boolean | "true" | "false") | undefined;
    'aria-dropeffect'?: "link" | "none" | "copy" | "execute" | "move" | "popup" | undefined;
    'aria-errormessage'?: string | undefined;
    'aria-expanded'?: (boolean | "true" | "false") | undefined;
    'aria-flowto'?: string | undefined;
    'aria-grabbed'?: (boolean | "true" | "false") | undefined;
    'aria-haspopup'?: boolean | "grid" | "dialog" | "menu" | "true" | "false" | "listbox" | "tree" | undefined;
    'aria-hidden'?: (boolean | "true" | "false") | undefined;
    'aria-invalid'?: boolean | "true" | "false" | "grammar" | "spelling" | undefined;
    'aria-keyshortcuts'?: string | undefined;
    'aria-label'?: string | undefined;
    'aria-labelledby'?: string | undefined;
    'aria-level'?: number | undefined;
    'aria-live'?: "off" | "assertive" | "polite" | undefined;
    'aria-modal'?: (boolean | "true" | "false") | undefined;
    'aria-multiline'?: (boolean | "true" | "false") | undefined;
    'aria-multiselectable'?: (boolean | "true" | "false") | undefined;
    'aria-orientation'?: "horizontal" | "vertical" | undefined;
    'aria-owns'?: string | undefined;
    'aria-placeholder'?: string | undefined;
    'aria-posinset'?: number | undefined;
    'aria-pressed'?: boolean | "true" | "false" | "mixed" | undefined;
    'aria-readonly'?: (boolean | "true" | "false") | undefined;
    'aria-relevant'?: "all" | "text" | "additions" | "additions removals" | "additions text" | "removals" | "removals additions" | "removals text" | "text additions" | "text removals" | undefined;
    'aria-required'?: (boolean | "true" | "false") | undefined;
    'aria-roledescription'?: string | undefined;
    'aria-rowcount'?: number | undefined;
    'aria-rowindex'?: number | undefined;
    'aria-rowindextext'?: string | undefined;
    'aria-rowspan'?: number | undefined;
    'aria-selected'?: (boolean | "true" | "false") | undefined;
    'aria-setsize'?: number | undefined;
    'aria-sort'?: "none" | "ascending" | "descending" | "other" | undefined;
    'aria-valuemax'?: number | undefined;
    'aria-valuemin'?: number | undefined;
    'aria-valuenow'?: number | undefined;
    'aria-valuetext'?: string | undefined;
    className: string;
    style: React.CSSProperties | undefined;
}, HTMLElement>;
export {};
//# sourceMappingURL=VerticalStack.d.ts.map