import React, { PureComponent, createRef, Children } from 'react';
import { motion } from '@shopify/polaris-tokens';
import { findFirstKeyboardFocusableNode } from '../../../../utilities/focus.js';
import { classNames } from '../../../../utilities/css.js';
import { isElementOfType, wrapWithComponent } from '../../../../utilities/components.js';
import { Key } from '../../../../types.js';
import { overlay } from '../../../shared.js';
import styles from '../../Popover.scss.js';
import { KeypressListener } from '../../../KeypressListener/KeypressListener.js';
import { PositionedOverlay } from '../../../PositionedOverlay/PositionedOverlay.js';
import { Pane } from '../Pane/Pane.js';
import { PortalsManagerContext } from '../../../../utilities/portals/context.js';
import { EventListener } from '../../../EventListener/EventListener.js';

let PopoverCloseSource;
(function (PopoverCloseSource) {
  PopoverCloseSource[PopoverCloseSource["Click"] = 0] = "Click";
  PopoverCloseSource[PopoverCloseSource["EscapeKeypress"] = 1] = "EscapeKeypress";
  PopoverCloseSource[PopoverCloseSource["FocusOut"] = 2] = "FocusOut";
  PopoverCloseSource[PopoverCloseSource["ScrollOut"] = 3] = "ScrollOut";
})(PopoverCloseSource || (PopoverCloseSource = {}));
var TransitionStatus;
(function (TransitionStatus) {
  TransitionStatus["Entering"] = "entering";
  TransitionStatus["Entered"] = "entered";
  TransitionStatus["Exiting"] = "exiting";
  TransitionStatus["Exited"] = "exited";
})(TransitionStatus || (TransitionStatus = {}));
class PopoverOverlay extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      transitionStatus: this.props.active ? TransitionStatus.Entering : TransitionStatus.Exited
    };
    this.contentNode = /*#__PURE__*/createRef();
    this.renderPopover = overlayDetails => {
      const {
        measuring,
        desiredHeight,
        positioning
      } = overlayDetails;
      const {
        id,
        children,
        sectioned,
        fullWidth,
        fullHeight,
        fluidContent,
        hideOnPrint,
        autofocusTarget,
        captureOverscroll
      } = this.props;
      const className = classNames(styles.Popover, positioning === 'above' && styles.positionedAbove, fullWidth && styles.fullWidth, measuring && styles.measuring, hideOnPrint && styles['PopoverOverlay-hideOnPrint']);
      const contentStyles = measuring ? undefined : {
        height: desiredHeight
      };
      const contentClassNames = classNames(styles.Content, fullHeight && styles['Content-fullHeight'], fluidContent && styles['Content-fluidContent']);
      return /*#__PURE__*/React.createElement("div", Object.assign({
        className: className
      }, overlay.props), /*#__PURE__*/React.createElement(EventListener, {
        event: "click",
        handler: this.handleClick
      }), /*#__PURE__*/React.createElement(EventListener, {
        event: "touchstart",
        handler: this.handleClick
      }), /*#__PURE__*/React.createElement(KeypressListener, {
        keyCode: Key.Escape,
        handler: this.handleEscape
      }), /*#__PURE__*/React.createElement("div", {
        className: styles.FocusTracker
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        ,
        tabIndex: 0,
        onFocus: this.handleFocusFirstItem
      }), /*#__PURE__*/React.createElement("div", {
        className: styles.ContentContainer
      }, /*#__PURE__*/React.createElement("div", {
        id: id,
        tabIndex: autofocusTarget === 'none' ? undefined : -1,
        className: contentClassNames,
        style: contentStyles,
        ref: this.contentNode
      }, renderPopoverContent(children, {
        captureOverscroll,
        sectioned
      }))), /*#__PURE__*/React.createElement("div", {
        className: styles.FocusTracker
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        ,
        tabIndex: 0,
        onFocus: this.handleFocusLastItem
      }));
    };
    this.handleClick = event => {
      const target = event.target;
      const {
        contentNode,
        props: {
          activator,
          onClose,
          preventCloseOnChildOverlayClick
        }
      } = this;
      const composedPath = event.composedPath();
      const wasDescendant = preventCloseOnChildOverlayClick ? wasPolarisPortalDescendant(composedPath, this.context.container) : wasContentNodeDescendant(composedPath, contentNode);
      const isActivatorDescendant = nodeContainsDescendant(activator, target);
      if (wasDescendant || isActivatorDescendant || this.state.transitionStatus !== TransitionStatus.Entered) {
        return;
      }
      onClose(PopoverCloseSource.Click);
    };
    this.handleScrollOut = () => {
      this.props.onClose(PopoverCloseSource.ScrollOut);
    };
    this.handleEscape = event => {
      const target = event.target;
      const {
        contentNode,
        props: {
          activator
        }
      } = this;
      const composedPath = event.composedPath();
      const wasDescendant = wasContentNodeDescendant(composedPath, contentNode);
      const isActivatorDescendant = nodeContainsDescendant(activator, target);
      if (wasDescendant || isActivatorDescendant) {
        this.props.onClose(PopoverCloseSource.EscapeKeypress);
      }
    };
    this.handleFocusFirstItem = () => {
      this.props.onClose(PopoverCloseSource.FocusOut);
    };
    this.handleFocusLastItem = () => {
      this.props.onClose(PopoverCloseSource.FocusOut);
    };
    this.overlayRef = /*#__PURE__*/createRef();
  }
  forceUpdatePosition() {
    this.overlayRef.current?.forceUpdatePosition();
  }
  changeTransitionStatus(transitionStatus, cb) {
    this.setState({
      transitionStatus
    }, cb);
    // Forcing a reflow to enable the animation
    this.contentNode.current && this.contentNode.current.getBoundingClientRect();
  }
  componentDidMount() {
    if (this.props.active) {
      this.focusContent();
      this.changeTransitionStatus(TransitionStatus.Entered);
    }
  }
  componentDidUpdate(oldProps) {
    if (this.props.active && !oldProps.active) {
      this.focusContent();
      this.changeTransitionStatus(TransitionStatus.Entering, () => {
        this.clearTransitionTimeout();
        this.enteringTimer = window.setTimeout(() => {
          this.setState({
            transitionStatus: TransitionStatus.Entered
          });
        }, parseInt(motion['motion-duration-100'], 10));
      });
    }
    if (!this.props.active && oldProps.active) {
      this.clearTransitionTimeout();
      this.setState({
        transitionStatus: TransitionStatus.Exited
      });
    }
  }
  componentWillUnmount() {
    this.clearTransitionTimeout();
  }
  render() {
    const {
      active,
      activator,
      fullWidth,
      preferredPosition = 'below',
      preferredAlignment = 'center',
      preferInputActivator = true,
      fixed,
      zIndexOverride
    } = this.props;
    const {
      transitionStatus
    } = this.state;
    if (transitionStatus === TransitionStatus.Exited && !active) return null;
    const className = classNames(styles.PopoverOverlay, transitionStatus === TransitionStatus.Entering && styles['PopoverOverlay-entering'], transitionStatus === TransitionStatus.Entered && styles['PopoverOverlay-open'], transitionStatus === TransitionStatus.Exiting && styles['PopoverOverlay-exiting']);
    return /*#__PURE__*/React.createElement(PositionedOverlay, {
      ref: this.overlayRef,
      fullWidth: fullWidth,
      active: active,
      activator: activator,
      preferInputActivator: preferInputActivator,
      preferredPosition: preferredPosition,
      preferredAlignment: preferredAlignment,
      render: this.renderPopover.bind(this),
      fixed: fixed,
      onScrollOut: this.handleScrollOut,
      classNames: className,
      zIndexOverride: zIndexOverride
    });
  }
  clearTransitionTimeout() {
    if (this.enteringTimer) {
      window.clearTimeout(this.enteringTimer);
    }
  }
  focusContent() {
    const {
      autofocusTarget = 'container'
    } = this.props;
    if (autofocusTarget === 'none' || this.contentNode == null) {
      return;
    }
    requestAnimationFrame(() => {
      if (this.contentNode.current == null) {
        return;
      }
      const focusableChild = findFirstKeyboardFocusableNode(this.contentNode.current);
      if (focusableChild && autofocusTarget === 'first-node') {
        focusableChild.focus({
          preventScroll: process.env.NODE_ENV === 'development'
        });
      } else {
        this.contentNode.current.focus({
          preventScroll: process.env.NODE_ENV === 'development'
        });
      }
    });
  }

  // eslint-disable-next-line @shopify/react-no-multiple-render-methods
}
PopoverOverlay.contextType = PortalsManagerContext;
function renderPopoverContent(children, props) {
  const childrenArray = Children.toArray(children);
  if (isElementOfType(childrenArray[0], Pane)) {
    return childrenArray;
  }
  return wrapWithComponent(childrenArray, Pane, props);
}
function nodeContainsDescendant(rootNode, descendant) {
  if (rootNode === descendant) {
    return true;
  }
  let parent = descendant.parentNode;
  while (parent != null) {
    if (parent === rootNode) {
      return true;
    }
    parent = parent.parentNode;
  }
  return false;
}
function wasContentNodeDescendant(composedPath, contentNode) {
  return contentNode.current != null && composedPath.includes(contentNode.current);
}
function wasPolarisPortalDescendant(composedPath, portalsContainerElement) {
  return composedPath.some(eventTarget => eventTarget instanceof Node && portalsContainerElement?.contains(eventTarget));
}

export { PopoverCloseSource, PopoverOverlay, nodeContainsDescendant };
