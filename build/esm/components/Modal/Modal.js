import React, { useState, useId, useRef, useCallback } from 'react';
import { TransitionGroup } from 'react-transition-group';
import { focusFirstFocusableNode } from '../../utilities/focus.js';
import { WithinContentContext } from '../../utilities/within-content-context.js';
import { wrapWithComponent } from '../../utilities/components.js';
import styles from './Modal.scss.js';
import { Section } from './components/Section/Section.js';
import { Dialog } from './components/Dialog/Dialog.js';
import { Header } from './components/Header/Header.js';
import { Backdrop } from '../Backdrop/Backdrop.js';
import { Footer } from './components/Footer/Footer.js';
import { useI18n } from '../../utilities/i18n/hooks.js';
import { Box } from '../Box/Box.js';
import { Scrollable } from '../Scrollable/Scrollable.js';
import { Portal } from '../Portal/Portal.js';
import { HorizontalStack } from '../HorizontalStack/HorizontalStack.js';
import { Spinner } from '../Spinner/Spinner.js';

const IFRAME_LOADING_HEIGHT = 200;
const DEFAULT_IFRAME_CONTENT_HEIGHT = 400;
const Modal = function Modal({
  children,
  title,
  titleHidden = false,
  src,
  iFrameName,
  open,
  instant,
  sectioned,
  loading,
  large,
  small,
  limitHeight,
  footer,
  primaryAction,
  secondaryActions,
  onScrolledToBottom,
  activator,
  onClose,
  onIFrameLoad,
  onTransitionEnd,
  noScroll,
  fullScreen
}) {
  const [iframeHeight, setIframeHeight] = useState(IFRAME_LOADING_HEIGHT);
  const [closing, setClosing] = useState(false);
  const headerId = useId();
  const activatorRef = useRef(null);
  const i18n = useI18n();
  const iframeTitle = i18n.translate('Polaris.Modal.iFrameTitle');
  let dialog;
  let backdrop;
  const handleEntered = useCallback(() => {
    if (onTransitionEnd) {
      onTransitionEnd();
    }
  }, [onTransitionEnd]);
  const handleExited = useCallback(() => {
    setIframeHeight(IFRAME_LOADING_HEIGHT);
    const activatorElement = activator && isRef(activator) ? activator && activator.current : activatorRef.current;
    if (activatorElement) {
      requestAnimationFrame(() => focusFirstFocusableNode(activatorElement));
    }
  }, [activator]);
  const handleIFrameLoad = useCallback(evt => {
    const iframe = evt.target;
    if (iframe && iframe.contentWindow) {
      try {
        setIframeHeight(iframe.contentWindow.document.body.scrollHeight);
      } catch (_error) {
        setIframeHeight(DEFAULT_IFRAME_CONTENT_HEIGHT);
      }
    }
    if (onIFrameLoad != null) {
      onIFrameLoad(evt);
    }
  }, [onIFrameLoad]);
  if (open) {
    const footerMarkup = !footer && !primaryAction && !secondaryActions ? null : /*#__PURE__*/React.createElement(Footer, {
      primaryAction: primaryAction,
      secondaryActions: secondaryActions
    }, footer);
    const content = sectioned ? wrapWithComponent(children, Section, {
      titleHidden
    }) : children;
    const body = loading ? /*#__PURE__*/React.createElement(Box, {
      padding: "4"
    }, /*#__PURE__*/React.createElement(HorizontalStack, {
      gap: "4",
      align: "center",
      blockAlign: "center"
    }, /*#__PURE__*/React.createElement(Spinner, null))) : content;
    const scrollContainerMarkup = noScroll ? /*#__PURE__*/React.createElement(Box, {
      width: "100%",
      overflowX: "hidden"
    }, body) : /*#__PURE__*/React.createElement(Scrollable, {
      shadow: true,
      className: styles.Body,
      onScrolledToBottom: onScrolledToBottom
    }, body);
    const bodyMarkup = src ? /*#__PURE__*/React.createElement("iframe", {
      name: iFrameName,
      title: iframeTitle,
      src: src,
      className: styles.IFrame,
      onLoad: handleIFrameLoad,
      style: {
        height: `${iframeHeight}px`
      }
    }) : scrollContainerMarkup;
    dialog = /*#__PURE__*/React.createElement(Dialog, {
      instant: instant,
      labelledBy: headerId,
      onClose: onClose,
      onEntered: handleEntered,
      onExited: handleExited,
      large: large,
      small: small,
      limitHeight: limitHeight,
      fullScreen: fullScreen,
      setClosing: setClosing
    }, /*#__PURE__*/React.createElement(Header, {
      titleHidden: titleHidden,
      id: headerId,
      closing: closing,
      onClose: onClose
    }, title), bodyMarkup, footerMarkup);
    backdrop = /*#__PURE__*/React.createElement(Backdrop, {
      setClosing: setClosing,
      onClick: onClose
    });
  }
  const animated = !instant;
  const activatorMarkup = activator && !isRef(activator) ? /*#__PURE__*/React.createElement(Box, {
    ref: activatorRef
  }, activator) : null;
  return /*#__PURE__*/React.createElement(WithinContentContext.Provider, {
    value: true
  }, activatorMarkup, /*#__PURE__*/React.createElement(Portal, {
    idPrefix: "modal"
  }, /*#__PURE__*/React.createElement(TransitionGroup, {
    appear: animated,
    enter: animated,
    exit: animated
  }, dialog), backdrop));
};
function isRef(ref) {
  return Object.prototype.hasOwnProperty.call(ref, 'current');
}
Modal.Section = Section;

export { Modal };
