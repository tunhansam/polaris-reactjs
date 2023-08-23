import React, { PureComponent } from 'react';
import type { HSBColor } from '../../../../utilities/color-types';
interface State {
    sliderHeight: number;
    draggerHeight: number;
}
export interface AlphaPickerProps {
    color: HSBColor;
    alpha: number;
    onChange(hue: number): void;
}
export declare class AlphaPicker extends PureComponent<AlphaPickerProps, State> {
    state: State;
    render(): React.JSX.Element;
    private setSliderHeight;
    private setDraggerHeight;
    private handleChange;
}
export {};
//# sourceMappingURL=AlphaPicker.d.ts.map