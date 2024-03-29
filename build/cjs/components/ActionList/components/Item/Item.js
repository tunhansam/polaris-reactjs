'use strict';

var React = require('react');
var polarisTokens = require('@shopify/polaris-tokens');
var css = require('../../../../utilities/css.js');
var ActionList = require('../../ActionList.scss.js');
var focus = require('../../../../utilities/focus.js');
var useIsomorphicLayoutEffect = require('../../../../utilities/use-isomorphic-layout-effect.js');
var Badge = require('../../../Badge/Badge.js');
var Tooltip = require('../../../Tooltip/Tooltip.js');
var UnstyledLink = require('../../../UnstyledLink/UnstyledLink.js');
var HorizontalStack = require('../../../HorizontalStack/HorizontalStack.js');
var hooks = require('../../../../utilities/features/hooks.js');
var Icon = require('../../../Icon/Icon.js');
var Box = require('../../../Box/Box.js');
var Text = require('../../../Text/Text.js');
var Scrollable = require('../../../Scrollable/Scrollable.js');

function Item({
  id,
  badge,
  content,
  accessibilityLabel,
  helpText,
  url,
  onAction,
  onMouseEnter,
  icon,
  image,
  prefix,
  suffix,
  disabled,
  external,
  destructive,
  ellipsis,
  truncate,
  active,
  role,
  variant = 'default'
}) {
  const {
    polarisSummerEditions2023
  } = hooks.useFeatures();
  const className = css.classNames(ActionList.default.Item, disabled && ActionList.default.disabled, destructive && ActionList.default.destructive, active && ActionList.default.active, variant === 'default' && ActionList.default.default, variant === 'indented' && ActionList.default.indented, variant === 'menu' && ActionList.default.menu);
  let prefixMarkup = null;
  if (prefix) {
    prefixMarkup = /*#__PURE__*/React.createElement("span", {
      className: ActionList.default.Prefix
    }, prefix);
  } else if (icon) {
    prefixMarkup = /*#__PURE__*/React.createElement("span", {
      className: ActionList.default.Prefix
    }, /*#__PURE__*/React.createElement(Icon.Icon, {
      source: icon
    }));
  } else if (image) {
    prefixMarkup = /*#__PURE__*/React.createElement("span", {
      role: "presentation",
      className: ActionList.default.Prefix,
      style: {
        backgroundImage: `url(${image}`
      }
    });
  }
  let contentText = content || '';
  if (truncate && content) {
    contentText = /*#__PURE__*/React.createElement(TruncateText, null, content);
  } else if (ellipsis) {
    contentText = `${content}…`;
  }
  const contentMarkup = helpText ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Box.Box, null, contentText), /*#__PURE__*/React.createElement(Text.Text, {
    as: "span",
    variant: polarisSummerEditions2023 ? 'bodySm' : undefined,
    color: polarisSummerEditions2023 && (active || disabled) ? undefined : 'subdued'
  }, helpText)) : contentText;
  const badgeMarkup = badge && /*#__PURE__*/React.createElement("span", {
    className: ActionList.default.Suffix
  }, /*#__PURE__*/React.createElement(Badge.Badge, {
    status: badge.status
  }, badge.content));
  const suffixMarkup = suffix && /*#__PURE__*/React.createElement(Box.Box, null, /*#__PURE__*/React.createElement("span", {
    className: ActionList.default.Suffix
  }, suffix));
  const textMarkup = /*#__PURE__*/React.createElement("span", {
    className: ActionList.default.Text
  }, contentMarkup);
  const contentElement = /*#__PURE__*/React.createElement(HorizontalStack.HorizontalStack, {
    blockAlign: "center",
    gap: polarisSummerEditions2023 ? '1_5-experimental' : '4',
    wrap: !truncate
  }, prefixMarkup, textMarkup, badgeMarkup, suffixMarkup);
  const contentWrapper = polarisSummerEditions2023 ? /*#__PURE__*/React.createElement(Box.Box, {
    width: "100%"
  }, contentElement) : contentElement;
  const scrollMarkup = active ? /*#__PURE__*/React.createElement(Scrollable.Scrollable.ScrollTo, null) : null;
  const control = url ? /*#__PURE__*/React.createElement(UnstyledLink.UnstyledLink, {
    id: id,
    url: disabled ? null : url,
    className: className,
    external: external,
    "aria-label": accessibilityLabel,
    onClick: disabled ? null : onAction,
    role: role
  }, contentWrapper) : /*#__PURE__*/React.createElement("button", {
    id: id,
    type: "button",
    className: className,
    disabled: disabled,
    "aria-label": accessibilityLabel,
    onClick: onAction,
    onMouseUp: focus.handleMouseUpByBlurring,
    role: role,
    onMouseEnter: onMouseEnter
  }, contentWrapper);
  return /*#__PURE__*/React.createElement(React.Fragment, null, scrollMarkup, control);
}
const TruncateText = ({
  children
}) => {
  const textRef = React.useRef(null);
  const [isOverflowing, setIsOverflowing] = React.useState(false);
  useIsomorphicLayoutEffect.useIsomorphicLayoutEffect(() => {
    if (textRef.current) {
      setIsOverflowing(textRef.current.scrollWidth > textRef.current.offsetWidth);
    }
  }, [children]);
  const text = /*#__PURE__*/React.createElement(Text.Text, {
    as: "span",
    truncate: true
  }, /*#__PURE__*/React.createElement(Box.Box, {
    width: "100%",
    ref: textRef
  }, children));
  return isOverflowing ? /*#__PURE__*/React.createElement(Tooltip.Tooltip, {
    zIndexOverride: Number(polarisTokens.zIndex['z-index-11']),
    preferredPosition: "above",
    hoverDelay: 1000,
    content: children,
    dismissOnMouseOut: true
  }, /*#__PURE__*/React.createElement(Text.Text, {
    as: "span",
    truncate: true
  }, children)) : text;
};

exports.Item = Item;
exports.TruncateText = TruncateText;
