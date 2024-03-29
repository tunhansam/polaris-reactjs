import React from 'react';
import { classNames } from '../../../../utilities/css.js';
import styles from '../../Layout.scss.js';

function Section({
  children,
  secondary,
  fullWidth,
  oneHalf,
  oneThird
}) {
  const className = classNames(styles.Section, secondary && styles['Section-secondary'], fullWidth && styles['Section-fullWidth'], oneHalf && styles['Section-oneHalf'], oneThird && styles['Section-oneThird']);
  return /*#__PURE__*/React.createElement("div", {
    className: className
  }, children);
}

export { Section };
