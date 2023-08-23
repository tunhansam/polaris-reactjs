import React from 'react';
import { classNames } from '../../../../utilities/css.js';
import styles from './Section.scss.js';
import { useFeatures } from '../../../../utilities/features/hooks.js';
import { Box } from '../../../Box/Box.js';

function Section({
  children,
  flush = false,
  subdued = false,
  titleHidden = false
}) {
  const {
    polarisSummerEditions2023
  } = useFeatures();
  const className = classNames(styles.Section, titleHidden && styles.titleHidden);
  return /*#__PURE__*/React.createElement("div", {
    className: className
  }, /*#__PURE__*/React.createElement(Box, Object.assign({
    as: "section"
    // eslint-disable-next-line no-nested-ternary
    ,
    padding: flush ? '0' : polarisSummerEditions2023 ? '4' : '5'
  }, titleHidden && {
    paddingInlineEnd: '0'
  }, subdued && {
    background: polarisSummerEditions2023 ? 'bg-secondary-experimental' : 'bg-subdued'
  }), children));
}

export { Section };
