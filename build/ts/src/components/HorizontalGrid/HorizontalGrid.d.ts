import React from 'react';
import type { SpaceScale } from '@shopify/polaris-tokens';
import type { ResponsiveProp } from '../../utilities/css';
type ColumnsAlias = 'oneThird' | 'oneHalf' | 'twoThirds';
type ColumnsType = number | string | ColumnsAlias[];
type Columns = ResponsiveProp<ColumnsType>;
type Gap = ResponsiveProp<SpaceScale>;
type HorizontalGridAlignItems = 'start' | 'end' | 'center';
export interface HorizontalGridProps extends React.AriaAttributes {
    children?: React.ReactNode;
    /** The number of columns to display. Accepts either a single value or an object of values for different screen sizes.
     * @example
     * columns={6}
     * columns={{xs: 1, sm: 1, md: 3, lg: 6, xl: 6}}
     */
    columns?: Columns;
    /** The spacing between children. Accepts a spacing token or an object of spacing tokens for different screen sizes.
     * @example
     * gap='2'
     * gap={{xs: '1', sm: '2', md: '3', lg: '4', xl: '5'}}
     */
    gap?: Gap;
    /** Vertical alignment of children. If not set, inline elements will stretch to the height of the parent.
     * @example
     * alignItems='start'
     */
    alignItems?: HorizontalGridAlignItems;
}
export declare function HorizontalGrid({ children, columns, gap, alignItems, }: HorizontalGridProps): React.JSX.Element;
export {};
//# sourceMappingURL=HorizontalGrid.d.ts.map