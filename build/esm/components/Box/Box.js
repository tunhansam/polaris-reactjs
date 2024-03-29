import React, { forwardRef } from 'react';
import { getResponsiveProps, classNames, sanitizeCustomProperties } from '../../utilities/css.js';
import styles from './Box.scss.js';

const Box = /*#__PURE__*/forwardRef(({
  as = 'div',
  background,
  borderColor,
  borderStyle,
  borderWidth,
  borderBlockStartWidth,
  borderBlockEndWidth,
  borderInlineStartWidth,
  borderInlineEndWidth,
  borderRadius,
  borderRadiusEndStart,
  borderRadiusEndEnd,
  borderRadiusStartStart,
  borderRadiusStartEnd,
  children,
  color,
  id,
  minHeight,
  minWidth,
  maxWidth,
  overflowX,
  overflowY,
  outlineColor,
  outlineStyle,
  outlineWidth,
  padding,
  paddingBlockStart,
  paddingBlockEnd,
  paddingInlineStart,
  paddingInlineEnd,
  role,
  shadow,
  tabIndex,
  width,
  printHidden,
  visuallyHidden,
  position,
  insetBlockStart,
  insetBlockEnd,
  insetInlineStart,
  insetInlineEnd,
  zIndex,
  opacity,
  ...restProps
}, ref) => {
  // eslint-disable-next-line no-nested-ternary
  const borderStyleValue = borderStyle ? borderStyle : borderColor || borderWidth || borderBlockStartWidth || borderBlockEndWidth || borderInlineStartWidth || borderInlineEndWidth ? 'solid' : undefined;

  // eslint-disable-next-line no-nested-ternary
  const outlineStyleValue = outlineStyle ? outlineStyle : outlineColor || outlineWidth ? 'solid' : undefined;
  const style = {
    '--pc-box-color': color ? `var(--p-color-${color})` : undefined,
    '--pc-box-background': background ? `var(--p-color-${background})` : undefined,
    // eslint-disable-next-line no-nested-ternary
    '--pc-box-border-color': borderColor ? borderColor === 'transparent' ? 'transparent' : `var(--p-color-${borderColor})` : undefined,
    '--pc-box-border-style': borderStyleValue,
    '--pc-box-border-radius': borderRadius ? `var(--p-border-radius-${borderRadius})` : undefined,
    '--pc-box-border-radius-end-start': borderRadiusEndStart ? `var(--p-border-radius-${borderRadiusEndStart})` : undefined,
    '--pc-box-border-radius-end-end': borderRadiusEndEnd ? `var(--p-border-radius-${borderRadiusEndEnd})` : undefined,
    '--pc-box-border-radius-start-start': borderRadiusStartStart ? `var(--p-border-radius-${borderRadiusStartStart})` : undefined,
    '--pc-box-border-radius-start-end': borderRadiusStartEnd ? `var(--p-border-radius-${borderRadiusStartEnd})` : undefined,
    '--pc-box-border-width': borderWidth ? `var(--p-border-width-${borderWidth})` : undefined,
    '--pc-box-border-block-start-width': borderBlockStartWidth ? `var(--p-border-width-${borderBlockStartWidth})` : undefined,
    '--pc-box-border-block-end-width': borderBlockEndWidth ? `var(--p-border-width-${borderBlockEndWidth})` : undefined,
    '--pc-box-border-inline-start-width': borderInlineStartWidth ? `var(--p-border-width-${borderInlineStartWidth})` : undefined,
    '--pc-box-border-inline-end-width': borderInlineEndWidth ? `var(--p-border-width-${borderInlineEndWidth})` : undefined,
    '--pc-box-min-height': minHeight,
    '--pc-box-min-width': minWidth,
    '--pc-box-max-width': maxWidth,
    '--pc-box-outline-color': outlineColor ? `var(--p-color-${outlineColor})` : undefined,
    '--pc-box-outline-style': outlineStyleValue,
    '--pc-box-outline-width': outlineWidth ? `var(--p-border-width-${outlineWidth})` : undefined,
    '--pc-box-overflow-x': overflowX,
    '--pc-box-overflow-y': overflowY,
    ...getResponsiveProps('box', 'padding-block-end', 'space', paddingBlockEnd || padding),
    ...getResponsiveProps('box', 'padding-block-start', 'space', paddingBlockStart || padding),
    ...getResponsiveProps('box', 'padding-inline-start', 'space', paddingInlineStart || padding),
    ...getResponsiveProps('box', 'padding-inline-end', 'space', paddingInlineEnd || padding),
    '--pc-box-shadow': shadow ? `var(--p-shadow-${shadow})` : undefined,
    '--pc-box-width': width,
    position,
    '--pc-box-inset-block-start': insetBlockStart ? `var(--p-space-${insetBlockStart})` : undefined,
    '--pc-box-inset-block-end': insetBlockEnd ? `var(--p-space-${insetBlockEnd})` : undefined,
    '--pc-box-inset-inline-start': insetInlineStart ? `var(--p-space-${insetInlineStart})` : undefined,
    '--pc-box-inset-inline-end': insetInlineEnd ? `var(--p-space-${insetInlineEnd})` : undefined,
    zIndex,
    opacity
  };
  const className = classNames(styles.Box, visuallyHidden && styles.visuallyHidden, printHidden && styles.printHidden, as === 'ul' && styles.listReset);
  return /*#__PURE__*/React.createElement(as, {
    className,
    id,
    ref,
    style: sanitizeCustomProperties(style),
    role,
    tabIndex,
    ...restProps
  }, children);
});
Box.displayName = 'Box';

export { Box };
