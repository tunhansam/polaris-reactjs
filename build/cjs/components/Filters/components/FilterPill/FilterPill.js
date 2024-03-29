'use strict';

var React = require('react');
var polarisIcons = require('@shopify/polaris-icons');
var useToggle = require('../../../../utilities/use-toggle.js');
var breakpoints = require('../../../../utilities/breakpoints.js');
var css = require('../../../../utilities/css.js');
var FilterPill$1 = require('./FilterPill.scss.js');
var hooks = require('../../../../utilities/i18n/hooks.js');
var hooks$1 = require('../../../../utilities/features/hooks.js');
var Text = require('../../../Text/Text.js');
var HorizontalStack = require('../../../HorizontalStack/HorizontalStack.js');
var UnstyledButton = require('../../../UnstyledButton/UnstyledButton.js');
var Icon = require('../../../Icon/Icon.js');
var Button = require('../../../Button/Button.js');
var Popover = require('../../../Popover/Popover.js');
var VerticalStack = require('../../../VerticalStack/VerticalStack.js');

function FilterPill({
  filterKey,
  label,
  filter,
  disabled,
  hideClearButton,
  selected,
  initialActive,
  closeOnChildOverlayClick,
  onRemove,
  onClick
}) {
  const i18n = hooks.useI18n();
  const {
    mdDown
  } = breakpoints.useBreakpoints();
  const {
    polarisSummerEditions2023
  } = hooks$1.useFeatures();
  const elementRef = React.useRef(null);
  const {
    value: focused,
    setTrue: setFocusedTrue,
    setFalse: setFocusedFalse
  } = useToggle.useToggle(false);
  const [popoverActive, setPopoverActive] = React.useState(initialActive);
  React.useEffect(() => {
    const node = elementRef.current;
    if (!node || !popoverActive) {
      return;
    }
    const parent = node.parentElement?.parentElement;
    if (!parent) {
      return;
    }
    parent.scroll?.({
      left: node.offsetLeft
    });
  }, [elementRef, popoverActive]);
  const togglePopoverActive = () => {
    if (filter) {
      setPopoverActive(popoverActive => !popoverActive);
    }
    if (onClick) {
      onClick(filterKey);
    }
  };
  const handleClear = () => {
    if (onRemove) onRemove(filterKey);
    setPopoverActive(false);
  };
  const buttonClasses = css.classNames(FilterPill$1.default.FilterButton, selected && FilterPill$1.default.ActiveFilterButton, popoverActive && FilterPill$1.default.FocusFilterButton, focused && FilterPill$1.default.focusedFilterButton, disabled && FilterPill$1.default.disabledFilterButton);
  const clearButtonClassNames = css.classNames(FilterPill$1.default.PlainButton, FilterPill$1.default.clearButton);
  const toggleButtonClassNames = css.classNames(FilterPill$1.default.PlainButton, FilterPill$1.default.ToggleButton);
  const se23LabelVariant = mdDown && polarisSummerEditions2023 ? 'bodyLg' : 'bodySm';
  const labelVariant = mdDown ? 'bodyMd' : 'bodySm';
  const wrappedLabel = /*#__PURE__*/React.createElement("div", {
    className: FilterPill$1.default.Label
  }, /*#__PURE__*/React.createElement(Text.Text, {
    variant: polarisSummerEditions2023 ? se23LabelVariant : labelVariant,
    as: "span"
  }, label));
  const activator = /*#__PURE__*/React.createElement("div", {
    className: buttonClasses
  }, /*#__PURE__*/React.createElement(HorizontalStack.HorizontalStack, {
    gap: "0",
    wrap: false
  }, /*#__PURE__*/React.createElement(UnstyledButton.UnstyledButton, {
    onFocus: setFocusedTrue,
    onBlur: setFocusedFalse,
    onClick: togglePopoverActive,
    className: toggleButtonClassNames,
    type: "button",
    disabled: disabled
  }, /*#__PURE__*/React.createElement(HorizontalStack.HorizontalStack, {
    wrap: false,
    align: "center",
    blockAlign: "center",
    gap: "0"
  }, selected ? /*#__PURE__*/React.createElement(React.Fragment, null, wrappedLabel) : /*#__PURE__*/React.createElement(React.Fragment, null, wrappedLabel, /*#__PURE__*/React.createElement("div", {
    className: FilterPill$1.default.IconWrapper
  }, /*#__PURE__*/React.createElement(Icon.Icon, {
    source: polarisSummerEditions2023 ? polarisIcons.ChevronDownMinor : polarisIcons.CaretDownMinor,
    color: "base"
  }))))), selected ? /*#__PURE__*/React.createElement(UnstyledButton.UnstyledButton, {
    onClick: handleClear,
    className: clearButtonClassNames,
    type: "button",
    "aria-label": i18n.translate('Polaris.FilterPill.clear'),
    disabled: disabled
  }, /*#__PURE__*/React.createElement("div", {
    className: FilterPill$1.default.IconWrapper
  }, /*#__PURE__*/React.createElement(Icon.Icon, {
    source: polarisIcons.CancelSmallMinor,
    color: "base"
  }))) : null));
  const clearButtonMarkup = !hideClearButton && /*#__PURE__*/React.createElement("div", {
    className: FilterPill$1.default.ClearButtonWrapper
  }, /*#__PURE__*/React.createElement(Button.Button, {
    onClick: handleClear,
    plain: true,
    disabled: !selected,
    textAlign: "left"
  }, i18n.translate('Polaris.FilterPill.clear')));
  if (disabled) {
    return null;
  }
  return /*#__PURE__*/React.createElement("div", {
    ref: elementRef
  }, /*#__PURE__*/React.createElement(Popover.Popover, {
    active: popoverActive && !disabled,
    activator: activator,
    key: filterKey,
    onClose: togglePopoverActive,
    preferredAlignment: "left",
    preventCloseOnChildOverlayClick: !closeOnChildOverlayClick
  }, /*#__PURE__*/React.createElement("div", {
    className: FilterPill$1.default.PopoverWrapper
  }, /*#__PURE__*/React.createElement(Popover.Popover.Section, null, /*#__PURE__*/React.createElement(VerticalStack.VerticalStack, {
    gap: "1"
  }, filter, clearButtonMarkup)))));
}

exports.FilterPill = FilterPill;
