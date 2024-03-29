import React from 'react';
import type { ActionListItemDescriptor, ActionListSection } from '../../types';
import type { ItemProps } from './components';
export interface ActionListProps {
    /** Collection of actions for list */
    items?: readonly ActionListItemDescriptor[];
    /** Collection of sectioned action items */
    sections?: readonly ActionListSection[];
    /** Defines a specific role attribute for each action in the list */
    actionRole?: 'menuitem' | string;
    /** Callback when any item is clicked or keypressed */
    onActionAnyItem?: ActionListItemDescriptor['onAction'];
}
export type ActionListItemProps = ItemProps;
export declare function ActionList({ items, sections, actionRole, onActionAnyItem, }: ActionListProps): React.JSX.Element;
export declare namespace ActionList {
    var Item: typeof import("./components").Item;
}
//# sourceMappingURL=ActionList.d.ts.map