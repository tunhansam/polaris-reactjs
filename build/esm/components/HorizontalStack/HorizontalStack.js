import React from 'react';
import { getResponsiveProps } from '../../utilities/css.js';
import styles from './HorizontalStack.scss.js';

const HorizontalStack = function HorizontalStack({
  align,
  blockAlign,
  gap,
  wrap = true,
  children
}) {
  const style = {
    '--pc-horizontal-stack-align': align,
    '--pc-horizontal-stack-block-align': blockAlign,
    '--pc-horizontal-stack-wrap': wrap ? 'wrap' : 'nowrap',
    ...getResponsiveProps('horizontal-stack', 'gap', 'space', gap)
  };
  return /*#__PURE__*/React.createElement("div", {
    className: styles.HorizontalStack,
    style: style
  }, children);
};

export { HorizontalStack };
