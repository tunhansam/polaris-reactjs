import React, { useRef, useEffect } from 'react';
import { Transition, CSSTransition } from 'react-transition-group';
import { motion } from '@shopify/polaris-tokens';
import { classNames } from '../../../../utilities/css.js';
import { focusFirstFocusableNode } from '../../../../utilities/focus.js';
import { Key } from '../../../../types.js';
import styles from './Dialog.scss.js';
import { TrapFocus } from '../../../TrapFocus/TrapFocus.js';
import { KeypressListener } from '../../../KeypressListener/KeypressListener.js';

function Dialog({
  instant,
  labelledBy,
  children,
  onClose,
  onExited,
  onEntered,
  large,
  small,
  limitHeight,
  fullScreen,
  setClosing,
  ...props
}) {
  const containerNode = useRef(null);
  const classes = classNames(styles.Modal, small && styles.sizeSmall, large && styles.sizeLarge, limitHeight && styles.limitHeight, fullScreen && styles.fullScreen);
  const TransitionChild = instant ? Transition : FadeUp;
  useEffect(() => {
    containerNode.current && !containerNode.current.contains(document.activeElement) && focusFirstFocusableNode(containerNode.current);
  }, []);
  const handleKeyDown = () => {
    if (setClosing) {
      setClosing(true);
    }
  };
  const handleKeyUp = () => {
    if (setClosing) {
      setClosing(false);
    }
    onClose();
  };
  return /*#__PURE__*/React.createElement(TransitionChild, Object.assign({}, props, {
    nodeRef: containerNode,
    mountOnEnter: true,
    unmountOnExit: true,
    timeout: parseInt(motion['motion-duration-200'], 10),
    onEntered: onEntered,
    onExited: onExited
  }), /*#__PURE__*/React.createElement("div", {
    className: styles.Container,
    "data-polaris-layer": true,
    "data-polaris-overlay": true,
    ref: containerNode
  }, /*#__PURE__*/React.createElement(TrapFocus, null, /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": true,
    "aria-label": labelledBy,
    "aria-labelledby": labelledBy,
    tabIndex: -1,
    className: styles.Dialog
  }, /*#__PURE__*/React.createElement("div", {
    className: classes
  }, /*#__PURE__*/React.createElement(KeypressListener, {
    keyCode: Key.Escape,
    keyEvent: "keydown",
    handler: handleKeyDown
  }), /*#__PURE__*/React.createElement(KeypressListener, {
    keyCode: Key.Escape,
    handler: handleKeyUp
  }), children)))));
}
const fadeUpClasses = {
  appear: classNames(styles.animateFadeUp, styles.entering),
  appearActive: classNames(styles.animateFadeUp, styles.entered),
  enter: classNames(styles.animateFadeUp, styles.entering),
  enterActive: classNames(styles.animateFadeUp, styles.entered),
  exit: classNames(styles.animateFadeUp, styles.exiting),
  exitActive: classNames(styles.animateFadeUp, styles.exited)
};
function FadeUp({
  children,
  ...props
}) {
  return /*#__PURE__*/React.createElement(CSSTransition, Object.assign({}, props, {
    classNames: fadeUpClasses
  }), children);
}

export { Dialog };
