import React from 'react';
import { CancelSmallMinor } from '@shopify/polaris-icons';
import { classNames } from '../../utilities/css.js';
import styles from './CalloutCard.scss.js';
import { LegacyCard } from '../LegacyCard/LegacyCard.js';
import { TextContainer } from '../TextContainer/TextContainer.js';
import { useFeatures } from '../../utilities/features/hooks.js';
import { buttonFrom } from '../Button/utils.js';
import { Button } from '../Button/Button.js';
import { Text } from '../Text/Text.js';
import { Image } from '../Image/Image.js';
import { ButtonGroup } from '../ButtonGroup/ButtonGroup.js';

function CalloutCard({
  title,
  children,
  illustration,
  primaryAction,
  secondaryAction,
  onDismiss
}) {
  const {
    polarisSummerEditions2023
  } = useFeatures();
  const primaryActionMarkup = buttonFrom(primaryAction);
  const secondaryActionMarkup = secondaryAction ? buttonFrom(secondaryAction, {
    plain: true,
    primary: polarisSummerEditions2023
  }) : null;
  const buttonMarkup = secondaryActionMarkup ? /*#__PURE__*/React.createElement(ButtonGroup, null, primaryActionMarkup, secondaryActionMarkup) : primaryActionMarkup;
  const dismissButton = onDismiss ? /*#__PURE__*/React.createElement("div", {
    className: styles.Dismiss
  }, /*#__PURE__*/React.createElement(Button, {
    plain: true,
    icon: CancelSmallMinor,
    onClick: onDismiss,
    accessibilityLabel: "Dismiss card"
  })) : null;
  const imageClassName = classNames(styles.Image, onDismiss && styles.DismissImage);
  const containerClassName = classNames(styles.Container, onDismiss && styles.hasDismiss);
  return /*#__PURE__*/React.createElement(LegacyCard, null, /*#__PURE__*/React.createElement("div", {
    className: containerClassName
  }, dismissButton, /*#__PURE__*/React.createElement(LegacyCard.Section, null, /*#__PURE__*/React.createElement("div", {
    className: styles.CalloutCard
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.Content
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.Title
  }, /*#__PURE__*/React.createElement(Text, {
    variant: "headingMd",
    as: "h2"
  }, title)), /*#__PURE__*/React.createElement(TextContainer, null, children), /*#__PURE__*/React.createElement("div", {
    className: styles.Buttons
  }, buttonMarkup)), /*#__PURE__*/React.createElement(Image, {
    alt: "",
    className: imageClassName,
    source: illustration
  })))));
}

export { CalloutCard };
