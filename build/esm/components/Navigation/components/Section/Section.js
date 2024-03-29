import React, { useRef, useState, useEffect, useId } from 'react';
import { HorizontalDotsMinor } from '@shopify/polaris-icons';
import { classNames } from '../../../../utilities/css.js';
import { useToggle } from '../../../../utilities/use-toggle.js';
import styles from '../../Navigation.scss.js';
import { Item } from '../Item/Item.js';
import { useMediaQuery } from '../../../../utilities/media-query/hooks.js';
import { Icon } from '../../../Icon/Icon.js';
import { Tooltip } from '../../../Tooltip/Tooltip.js';
import { Text } from '../../../Text/Text.js';
import { Collapsible } from '../../../Collapsible/Collapsible.js';

function Section({
  title,
  fill,
  action,
  items,
  rollup,
  separator
}) {
  const {
    value: expanded,
    toggle: toggleExpanded,
    setFalse: setExpandedFalse
  } = useToggle(false);
  const animationFrame = useRef(null);
  const {
    isNavigationCollapsed
  } = useMediaQuery();
  const [expandedIndex, setExpandedIndex] = useState();
  const handleClick = (onClick, hasSubNavItems) => {
    return () => {
      if (onClick) {
        onClick();
      }
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      if (!hasSubNavItems || !isNavigationCollapsed) {
        animationFrame.current = requestAnimationFrame(setExpandedFalse);
      }
    };
  };
  useEffect(() => {
    return () => {
      animationFrame.current && cancelAnimationFrame(animationFrame.current);
    };
  });
  const className = classNames(styles.Section, separator && styles['Section-withSeparator'], fill && styles['Section-fill']);
  const buttonMarkup = action && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: styles.Action,
    "aria-label": action.accessibilityLabel,
    onClick: action.onClick
  }, /*#__PURE__*/React.createElement(Icon, {
    source: action.icon
  }));
  const actionMarkup = action && (action.tooltip ? /*#__PURE__*/React.createElement(Tooltip, action.tooltip, buttonMarkup) : buttonMarkup);
  const sectionHeadingMarkup = title && /*#__PURE__*/React.createElement("li", {
    className: styles.SectionHeading
  }, /*#__PURE__*/React.createElement(Text, {
    as: "span",
    variant: "bodySm",
    fontWeight: "medium",
    color: "subdued"
  }, title), actionMarkup);
  const itemsMarkup = items.map((item, index) => {
    const {
      onClick,
      label,
      subNavigationItems,
      ...rest
    } = item;
    const hasSubNavItems = subNavigationItems != null && subNavigationItems.length > 0;
    const handleToggleExpandedState = () => {
      if (expandedIndex === index) {
        setExpandedIndex(-1);
      } else {
        setExpandedIndex(index);
      }
    };
    return /*#__PURE__*/React.createElement(Item, Object.assign({
      key: label
    }, rest, {
      label: label,
      subNavigationItems: subNavigationItems,
      onClick: handleClick(onClick, hasSubNavItems),
      onToggleExpandedState: handleToggleExpandedState,
      expanded: expandedIndex === index
    }));
  });
  const toggleClassName = classNames(styles.Item, styles.RollupToggle);
  const ariaLabel = rollup && (expanded ? rollup.hide : rollup.view);
  const toggleRollup = rollup && items.length > rollup.after && /*#__PURE__*/React.createElement("div", {
    className: styles.ListItem,
    key: "List Item"
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.ItemWrapper
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.ItemInnerWrapper
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: toggleClassName,
    onClick: toggleExpanded,
    "aria-label": ariaLabel
  }, /*#__PURE__*/React.createElement("span", {
    className: styles.Icon
  }, /*#__PURE__*/React.createElement(Icon, {
    source: HorizontalDotsMinor
  }))))));
  const activeItemIndex = items.findIndex(item => {
    if (!rollup) {
      return false;
    }
    return rollup.activePath === item.url || item.url && rollup.activePath.startsWith(item.url) || (item.subNavigationItems ? item.subNavigationItems.some(({
      url: itemUrl
    }) => rollup.activePath.startsWith(itemUrl)) : false);
  });
  const sectionItems = rollup ? itemsMarkup.slice(0, rollup.after) : itemsMarkup;
  const additionalItems = rollup ? itemsMarkup.slice(rollup.after) : [];
  if (rollup && activeItemIndex !== -1 && activeItemIndex > rollup.after - 1) {
    sectionItems.push(...additionalItems.splice(activeItemIndex - rollup.after, 1));
  }
  const additionalItemsId = useId();
  const activeItemsMarkup = rollup && additionalItems.length > 0 && /*#__PURE__*/React.createElement("li", {
    className: styles.RollupSection
  }, /*#__PURE__*/React.createElement(Collapsible, {
    id: additionalItemsId,
    open: expanded
  }, /*#__PURE__*/React.createElement("ul", {
    className: styles.List
  }, additionalItems)), toggleRollup);
  return /*#__PURE__*/React.createElement("ul", {
    className: className
  }, sectionHeadingMarkup, sectionItems, activeItemsMarkup);
}

export { Section };
