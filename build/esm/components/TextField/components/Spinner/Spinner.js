import React from 'react';
import { ChevronUpMinor, CaretUpMinor, ChevronDownMinor, CaretDownMinor } from '@shopify/polaris-icons';
import styles from '../../TextField.scss.js';
import { useFeatures } from '../../../../utilities/features/hooks.js';
import { Icon } from '../../../Icon/Icon.js';

const Spinner = /*#__PURE__*/React.forwardRef(function Spinner({
  onChange,
  onClick,
  onMouseDown,
  onMouseUp,
  onBlur
}, ref) {
  const {
    polarisSummerEditions2023
  } = useFeatures();
  function handleStep(step) {
    return () => onChange(step);
  }
  function handleMouseDown(onChange) {
    return event => {
      if (event.button !== 0) return;
      onMouseDown(onChange);
    };
  }
  return /*#__PURE__*/React.createElement("div", {
    className: styles.Spinner,
    onClick: onClick,
    "aria-hidden": true,
    ref: ref
  }, /*#__PURE__*/React.createElement("div", {
    role: "button",
    className: styles.Segment,
    tabIndex: -1,
    onClick: handleStep(1),
    onMouseDown: handleMouseDown(handleStep(1)),
    onMouseUp: onMouseUp,
    onBlur: onBlur
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.SpinnerIcon
  }, /*#__PURE__*/React.createElement(Icon, {
    source: polarisSummerEditions2023 ? ChevronUpMinor : CaretUpMinor
  }))), /*#__PURE__*/React.createElement("div", {
    role: "button",
    className: styles.Segment,
    tabIndex: -1,
    onClick: handleStep(-1),
    onMouseDown: handleMouseDown(handleStep(-1)),
    onMouseUp: onMouseUp,
    onBlur: onBlur
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.SpinnerIcon
  }, /*#__PURE__*/React.createElement(Icon, {
    source: polarisSummerEditions2023 ? ChevronDownMinor : CaretDownMinor
  }))));
});

export { Spinner };
