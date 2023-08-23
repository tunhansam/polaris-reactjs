import React from 'react';
import styles from './Divider.scss.js';

const Divider = ({
  borderColor = 'border-subdued',
  borderWidth = '1'
}) => {
  const borderColorValue = borderColor === 'transparent' ? borderColor : `var(--p-color-${borderColor})`;
  return /*#__PURE__*/React.createElement("hr", {
    className: styles.Divider,
    style: {
      borderBlockStart: `var(--p-border-width-${borderWidth}) solid ${borderColorValue}`
    }
  });
};

export { Divider };
