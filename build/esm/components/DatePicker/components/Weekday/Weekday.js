import React, { memo } from 'react';
import { classNames } from '../../../../utilities/css.js';
import styles from '../../DatePicker.scss.js';

const Weekday = /*#__PURE__*/memo(function Weekday({
  label,
  title,
  current
}) {
  const className = classNames(styles.Weekday, current && styles['Weekday-current']);
  return /*#__PURE__*/React.createElement("th", {
    "aria-label": label,
    scope: "col",
    className: className
  }, title);
});

export { Weekday };
