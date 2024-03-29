'use strict';

var React = require('react');
var css = require('../../utilities/css.js');
var withinFilterContext = require('../../utilities/within-filter-context.js');
var Badge$1 = require('./Badge.scss.js');
var utils = require('./utils.js');
var Icon = require('../Icon/Icon.js');
var Pip = require('./components/Pip/Pip.js');
var hooks = require('../../utilities/i18n/hooks.js');
var hooks$1 = require('../../utilities/features/hooks.js');
var Text = require('../Text/Text.js');

const DEFAULT_SIZE = 'medium';
const progressIconMap = {
  complete: () => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 20 20"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 10c0-.93 0-1.395.102-1.776a3 3 0 0 1 2.121-2.122C8.605 6 9.07 6 10 6c.93 0 1.395 0 1.776.102a3 3 0 0 1 2.122 2.122C14 8.605 14 9.07 14 10s0 1.395-.102 1.777a3 3 0 0 1-2.122 2.12C11.395 14 10.93 14 10 14s-1.395 0-1.777-.102a3 3 0 0 1-2.12-2.121C6 11.395 6 10.93 6 10Z"
  })),
  partiallyComplete: () => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 20 20"
  }, /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    d: "m8.888 6.014-.017-.018-.02.02c-.253.013-.45.038-.628.086a3 3 0 0 0-2.12 2.122C6 8.605 6 9.07 6 10s0 1.395.102 1.777a3 3 0 0 0 2.121 2.12C8.605 14 9.07 14 10 14c.93 0 1.395 0 1.776-.102a3 3 0 0 0 2.122-2.121C14 11.395 14 10.93 14 10c0-.93 0-1.395-.102-1.776a3 3 0 0 0-2.122-2.122C11.395 6 10.93 6 10 6c-.475 0-.829 0-1.112.014ZM8.446 7.34a1.75 1.75 0 0 0-1.041.94l4.314 4.315c.443-.2.786-.576.941-1.042L8.446 7.34Zm4.304 2.536L10.124 7.25c.908.001 1.154.013 1.329.06a1.75 1.75 0 0 1 1.237 1.237c.047.175.059.42.06 1.329ZM8.547 12.69c.182.05.442.06 1.453.06h.106L7.25 9.894V10c0 1.01.01 1.27.06 1.453a1.75 1.75 0 0 0 1.237 1.237Z"
  })),
  incomplete: () => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 20 20"
  }, /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    d: "M8.547 12.69c.183.05.443.06 1.453.06s1.27-.01 1.453-.06a1.75 1.75 0 0 0 1.237-1.237c.05-.182.06-.443.06-1.453s-.01-1.27-.06-1.453a1.75 1.75 0 0 0-1.237-1.237c-.182-.05-.443-.06-1.453-.06s-1.27.01-1.453.06A1.75 1.75 0 0 0 7.31 8.547c-.05.183-.06.443-.06 1.453s.01 1.27.06 1.453a1.75 1.75 0 0 0 1.237 1.237ZM6.102 8.224C6 8.605 6 9.07 6 10s0 1.395.102 1.777a3 3 0 0 0 2.122 2.12C8.605 14 9.07 14 10 14s1.395 0 1.777-.102a3 3 0 0 0 2.12-2.121C14 11.395 14 10.93 14 10c0-.93 0-1.395-.102-1.776a3 3 0 0 0-2.121-2.122C11.395 6 10.93 6 10 6c-.93 0-1.395 0-1.776.102a3 3 0 0 0-2.122 2.122Z"
  }))
};
function Badge({
  children,
  status,
  progress,
  icon,
  size = DEFAULT_SIZE,
  statusAndProgressLabelOverride
}) {
  const i18n = hooks.useI18n();
  const {
    polarisSummerEditions2023
  } = hooks$1.useFeatures();
  const withinFilter = React.useContext(withinFilterContext.WithinFilterContext);
  const className = css.classNames(Badge$1.default.Badge, status && Badge$1.default[css.variationName('status', status)], size && size !== DEFAULT_SIZE && Badge$1.default[css.variationName('size', size)], withinFilter && Badge$1.default.withinFilter);
  const accessibilityLabel = statusAndProgressLabelOverride ? statusAndProgressLabelOverride : utils.getDefaultAccessibilityLabel(i18n, progress, status);
  let accessibilityMarkup = Boolean(accessibilityLabel) && /*#__PURE__*/React.createElement(Text.Text, {
    as: "span",
    visuallyHidden: true
  }, accessibilityLabel);
  if (progress && !icon) {
    accessibilityMarkup = polarisSummerEditions2023 ? /*#__PURE__*/React.createElement("span", {
      className: Badge$1.default.Icon
    }, /*#__PURE__*/React.createElement(Icon.Icon, {
      accessibilityLabel: accessibilityLabel,
      source: progressIconMap[progress]
    })) : /*#__PURE__*/React.createElement("span", {
      className: Badge$1.default.PipContainer
    }, /*#__PURE__*/React.createElement(Pip.Pip, {
      progress: progress,
      status: status,
      accessibilityLabelOverride: accessibilityLabel
    }));
  }
  return /*#__PURE__*/React.createElement("span", {
    className: className
  }, accessibilityMarkup, icon && /*#__PURE__*/React.createElement("span", {
    className: Badge$1.default.Icon
  }, /*#__PURE__*/React.createElement(Icon.Icon, {
    source: icon
  })), children && /*#__PURE__*/React.createElement(Text.Text, {
    as: "span",
    variant: "bodySm",
    fontWeight: status === 'new' ? 'medium' : undefined
  }, children));
}
Badge.Pip = Pip.Pip;

exports.Badge = Badge;
