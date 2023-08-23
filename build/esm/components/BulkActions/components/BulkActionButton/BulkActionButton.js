import React, { useRef } from 'react';
import { HorizontalDotsMinor } from '@shopify/polaris-icons';
import { useComponentDidMount } from '../../../../utilities/use-component-did-mount.js';
import styles from '../../BulkActions.scss.js';
import { Indicator } from '../../../Indicator/Indicator.js';
import { Tooltip } from '../../../Tooltip/Tooltip.js';
import { Button } from '../../../Button/Button.js';
import { Icon } from '../../../Icon/Icon.js';

function BulkActionButton({
  handleMeasurement,
  url,
  external,
  onAction,
  content,
  disclosure,
  accessibilityLabel,
  disabled,
  indicator,
  showContentInButton
}) {
  const bulkActionButton = useRef(null);
  useComponentDidMount(() => {
    if (handleMeasurement && bulkActionButton.current) {
      const width = bulkActionButton.current.getBoundingClientRect().width;
      handleMeasurement(width);
    }
  });
  const isActivatorForMoreActionsPopover = disclosure && !showContentInButton;
  const buttonContent = isActivatorForMoreActionsPopover ? undefined : content;
  const buttonMarkup = /*#__PURE__*/React.createElement(Button, {
    external: external,
    url: url,
    accessibilityLabel: isActivatorForMoreActionsPopover ? content : accessibilityLabel,
    disclosure: disclosure && showContentInButton,
    onClick: onAction,
    disabled: disabled,
    size: "slim",
    icon: isActivatorForMoreActionsPopover ? /*#__PURE__*/React.createElement(Icon, {
      source: HorizontalDotsMinor,
      color: "base"
    }) : undefined
  }, buttonContent);
  return /*#__PURE__*/React.createElement("div", {
    className: styles.BulkActionButton,
    ref: bulkActionButton
  }, isActivatorForMoreActionsPopover ? /*#__PURE__*/React.createElement(Tooltip, {
    content: content,
    preferredPosition: "above"
  }, buttonMarkup) : buttonMarkup, indicator && /*#__PURE__*/React.createElement(Indicator, null));
}

export { BulkActionButton };
