import React from 'react';
export interface TitleProps {
    /** Page title, in large type */
    title?: string;
    /** Page subtitle, in regular type */
    subtitle?: string;
    /** Important and non-interactive status information shown immediately after the title. */
    titleMetadata?: React.ReactNode;
    /** Removes spacing between title and subtitle */
    compactTitle?: boolean;
}
export declare function Title({ title, subtitle, titleMetadata, compactTitle, }: TitleProps): React.JSX.Element;
//# sourceMappingURL=Title.d.ts.map