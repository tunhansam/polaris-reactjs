import React, { memo } from 'react';
import { classNames } from '../../../../utilities/css.js';
import styles from '../../IndexTable.scss.js';

const Cell = /*#__PURE__*/memo(function Cell({
  children,
  className,
  flush
}) {
  const cellClassName = classNames(className, styles.TableCell, flush && styles['TableCell-flush']);
  return /*#__PURE__*/React.createElement("td", {
    className: cellClassName
  }, children);
});

export { Cell };
