import React, { useCallback } from 'react';
import { CircleAlertMajor } from '@shopify/polaris-icons';
import { classNames } from '../../../../utilities/css.js';
import { getWidth } from '../../../../utilities/get-width.js';
import { useToggle } from '../../../../utilities/use-toggle.js';
import styles from './ContextualSaveBar.scss.js';
import { DiscardConfirmationModal } from './components/DiscardConfirmationModal/DiscardConfirmationModal.js';
import { useI18n } from '../../../../utilities/i18n/hooks.js';
import { useFrame } from '../../../../utilities/frame/hooks.js';
import { useFeatures } from '../../../../utilities/features/hooks.js';
import { Button } from '../../../Button/Button.js';
import { Image } from '../../../Image/Image.js';
import { Icon } from '../../../Icon/Icon.js';
import { Text } from '../../../Text/Text.js';
import { LegacyStack } from '../../../LegacyStack/LegacyStack.js';

function ContextualSaveBar({
  alignContentFlush,
  message,
  saveAction,
  discardAction,
  fullWidth,
  contextControl,
  secondaryMenu
}) {
  const i18n = useI18n();
  const {
    logo
  } = useFrame();
  const {
    value: discardConfirmationModalVisible,
    toggle: toggleDiscardConfirmationModal,
    setFalse: closeDiscardConfirmationModal
  } = useToggle(false);
  const {
    polarisSummerEditions2023
  } = useFeatures();
  const handleDiscardAction = useCallback(() => {
    if (discardAction && discardAction.onAction) {
      discardAction.onAction();
    }
    closeDiscardConfirmationModal();
  }, [closeDiscardConfirmationModal, discardAction]);
  const discardActionContent = discardAction && discardAction.content ? discardAction.content : i18n.translate('Polaris.ContextualSaveBar.discard');
  let discardActionHandler;
  if (discardAction && discardAction.discardConfirmationModal) {
    discardActionHandler = toggleDiscardConfirmationModal;
  } else if (discardAction) {
    discardActionHandler = discardAction.onAction;
  }
  const discardConfirmationModalMarkup = discardAction && discardAction.onAction && discardAction.discardConfirmationModal && /*#__PURE__*/React.createElement(DiscardConfirmationModal, {
    open: discardConfirmationModalVisible,
    onCancel: toggleDiscardConfirmationModal,
    onDiscard: handleDiscardAction
  });
  const discardActionMarkup = discardAction && /*#__PURE__*/React.createElement(Button, {
    plain: polarisSummerEditions2023,
    primary: polarisSummerEditions2023,
    size: polarisSummerEditions2023 ? 'large' : undefined,
    url: discardAction.url,
    onClick: discardActionHandler,
    loading: discardAction.loading,
    disabled: discardAction.disabled,
    accessibilityLabel: discardAction.content
  }, discardActionContent);
  const saveActionContent = saveAction && saveAction.content ? saveAction.content : i18n.translate('Polaris.ContextualSaveBar.save');
  const saveActionMarkup = saveAction && /*#__PURE__*/React.createElement(Button, {
    primary: !polarisSummerEditions2023,
    primarySuccess: polarisSummerEditions2023,
    size: polarisSummerEditions2023 ? 'large' : undefined,
    url: saveAction.url,
    onClick: saveAction.onAction,
    loading: saveAction.loading,
    disabled: saveAction.disabled,
    accessibilityLabel: saveAction.content
  }, saveActionContent);
  const width = getWidth(logo, 104);
  const imageMarkup = logo && /*#__PURE__*/React.createElement(Image, {
    style: {
      width
    },
    source: logo.contextualSaveBarSource || '',
    alt: ""
  });
  const logoMarkup = alignContentFlush || contextControl ? null : /*#__PURE__*/React.createElement("div", {
    className: styles.LogoContainer,
    style: {
      width
    }
  }, imageMarkup);
  const contextControlMarkup = contextControl ? /*#__PURE__*/React.createElement("div", {
    className: styles.ContextControl
  }, contextControl) : null;
  const contentsClassName = classNames(styles.Contents, fullWidth && styles.fullWidth);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: styles.ContextualSaveBar
  }, contextControlMarkup, logoMarkup, /*#__PURE__*/React.createElement("div", {
    className: contentsClassName
  }, polarisSummerEditions2023 ? /*#__PURE__*/React.createElement("div", {
    className: styles.MessageContainer
  }, /*#__PURE__*/React.createElement(Icon, {
    source: CircleAlertMajor
  }), message && /*#__PURE__*/React.createElement(Text, {
    as: "h2",
    variant: "headingMd",
    color: "text-inverse",
    truncate: true
  }, message)) : message && /*#__PURE__*/React.createElement(Text, {
    as: "h2",
    variant: "headingMd",
    color: "text-inverse",
    truncate: true
  }, message), /*#__PURE__*/React.createElement("div", {
    className: styles.ActionContainer
  }, /*#__PURE__*/React.createElement(LegacyStack, {
    spacing: "tight",
    wrap: false
  }, secondaryMenu, discardActionMarkup, saveActionMarkup)))), discardConfirmationModalMarkup);
}

export { ContextualSaveBar };
