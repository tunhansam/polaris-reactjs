'use strict';

var React = require('react');
var reactTransitionGroup = require('react-transition-group');
var debounce = require('../../utilities/debounce.js');
var css = require('../../utilities/css.js');
var clamp = require('../../utilities/clamp.js');
var BulkActions$1 = require('./BulkActions.scss.js');
var BulkActionMenu = require('./components/BulkActionMenu/BulkActionMenu.js');
var hooks = require('../../utilities/i18n/hooks.js');
var BulkActionButton = require('./components/BulkActionButton/BulkActionButton.js');
var Popover = require('../Popover/Popover.js');
var ActionList = require('../ActionList/ActionList.js');
var EventListener = require('../EventListener/EventListener.js');
var HorizontalStack = require('../HorizontalStack/HorizontalStack.js');

const MAX_PROMOTED_ACTIONS = 2;
const BUTTONS_NODE_ADDITIONAL_WIDTH = 64;
class BulkActionsInner extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      popoverVisible: false,
      containerWidth: 0,
      measuring: true
    };
    this.containerNode = null;
    this.buttonsNode = null;
    this.moreActionsNode = null;
    this.groupNode = /*#__PURE__*/React.createRef();
    this.promotedActionsWidths = [];
    this.bulkActionsWidth = 0;
    this.addedMoreActionsWidthForMeasuring = 0;
    this.handleResize = debounce.debounce(() => {
      const {
        popoverVisible
      } = this.state;
      if (this.containerNode) {
        const containerWidth = this.containerNode.getBoundingClientRect().width;
        if (containerWidth > 0) {
          this.setState({
            containerWidth
          });
        }
      }
      if (popoverVisible) {
        this.setState({
          popoverVisible: false
        });
      }
    }, 50, {
      trailing: true
    });
    this.setButtonsNode = node => {
      this.buttonsNode = node;
    };
    this.setContainerNode = node => {
      this.containerNode = node;
    };
    this.setMoreActionsNode = node => {
      this.moreActionsNode = node;
    };
    this.togglePopover = () => {
      if (this.props.onMoreActionPopoverToggle) {
        this.props.onMoreActionPopoverToggle(this.state.popoverVisible);
      }
      this.setState(({
        popoverVisible
      }) => ({
        popoverVisible: !popoverVisible
      }));
    };
    this.handleMeasurement = width => {
      const {
        measuring
      } = this.state;
      if (measuring) {
        this.promotedActionsWidths.push(width);
      }
    };
  }
  numberOfPromotedActionsToRender() {
    const {
      promotedActions
    } = this.props;
    const {
      containerWidth,
      measuring
    } = this.state;
    if (!promotedActions) {
      return 0;
    }
    const containerWidthMinusAdditionalWidth = Math.max(0, containerWidth - BUTTONS_NODE_ADDITIONAL_WIDTH);
    if (containerWidthMinusAdditionalWidth >= this.bulkActionsWidth || measuring) {
      return promotedActions.length;
    }
    let sufficientSpace = false;
    let counter = promotedActions.length - 1;
    let totalWidth = 0;
    while (!sufficientSpace && counter >= 0) {
      totalWidth += this.promotedActionsWidths[counter];
      const widthWithRemovedAction = this.bulkActionsWidth - totalWidth + this.addedMoreActionsWidthForMeasuring;
      if (containerWidthMinusAdditionalWidth >= widthWithRemovedAction) {
        sufficientSpace = true;
      } else {
        counter--;
      }
    }
    return clamp.clamp(counter, 0, promotedActions.length);
  }
  actionSections() {
    const {
      actions
    } = this.props;
    if (!actions || actions.length === 0) {
      return;
    }
    if (instanceOfBulkActionListSectionArray(actions)) {
      return actions;
    }
    if (instanceOfBulkActionArray(actions)) {
      return [{
        items: actions
      }];
    }
  }
  rolledInPromotedActions() {
    const {
      promotedActions
    } = this.props;
    const numberOfPromotedActionsToRender = this.numberOfPromotedActionsToRender();
    if (!promotedActions || promotedActions.length === 0 || numberOfPromotedActionsToRender >= promotedActions.length) {
      return [];
    }
    const rolledInPromotedActions = promotedActions.map(action => {
      if (instanceOfMenuGroupDescriptor(action)) {
        return {
          items: [...action.actions]
        };
      }
      return {
        items: [action]
      };
    });
    return rolledInPromotedActions.slice(numberOfPromotedActionsToRender);
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  componentDidMount() {
    const {
      actions,
      promotedActions
    } = this.props;
    if (promotedActions && !actions && this.moreActionsNode) {
      this.addedMoreActionsWidthForMeasuring = this.moreActionsNode.getBoundingClientRect().width;
    }
    this.bulkActionsWidth = this.buttonsNode ? this.buttonsNode.getBoundingClientRect().width - this.addedMoreActionsWidthForMeasuring : 0;
    if (this.containerNode) {
      this.setState({
        containerWidth: this.containerNode.getBoundingClientRect().width,
        measuring: false
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  render() {
    const {
      selectMode,
      disabled,
      promotedActions,
      i18n,
      isSticky,
      width
    } = this.props;
    const actionSections = this.actionSections();
    if (promotedActions && promotedActions.length > MAX_PROMOTED_ACTIONS && process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn(i18n.translate('Polaris.ResourceList.BulkActions.warningMessage', {
        maxPromotedActions: MAX_PROMOTED_ACTIONS
      }));
    }
    const {
      popoverVisible,
      measuring
    } = this.state;
    const numberOfPromotedActionsToRender = this.numberOfPromotedActionsToRender();
    const promotedActionsMarkup = promotedActions && numberOfPromotedActionsToRender > 0 ? [...promotedActions].slice(0, numberOfPromotedActionsToRender).map((action, index) => {
      if (instanceOfMenuGroupDescriptor(action)) {
        return /*#__PURE__*/React.createElement(BulkActionMenu.BulkActionMenu, Object.assign({
          key: index
        }, action, {
          isNewBadgeInBadgeActions: this.isNewBadgeInBadgeActions()
        }));
      }
      return /*#__PURE__*/React.createElement(BulkActionButton.BulkActionButton, Object.assign({
        key: index,
        disabled: disabled
      }, action, {
        handleMeasurement: this.handleMeasurement
      }));
    }) : null;
    const rolledInPromotedActions = this.rolledInPromotedActions();
    const activatorLabel = !promotedActions || promotedActions && numberOfPromotedActionsToRender === 0 && !measuring ? i18n.translate('Polaris.ResourceList.BulkActions.actionsActivatorLabel') : i18n.translate('Polaris.ResourceList.BulkActions.moreActionsActivatorLabel');
    let combinedActions = [];
    if (actionSections && rolledInPromotedActions.length > 0) {
      combinedActions = [...rolledInPromotedActions, ...actionSections];
    } else if (actionSections) {
      combinedActions = actionSections;
    } else if (rolledInPromotedActions.length > 0) {
      combinedActions = [...rolledInPromotedActions];
    }
    const actionsPopover = actionSections || rolledInPromotedActions.length > 0 || measuring ? /*#__PURE__*/React.createElement("div", {
      className: BulkActions$1.default.Popover,
      ref: this.setMoreActionsNode
    }, /*#__PURE__*/React.createElement(Popover.Popover, {
      active: popoverVisible,
      activator: /*#__PURE__*/React.createElement(BulkActionButton.BulkActionButton, {
        disclosure: true,
        showContentInButton: !promotedActionsMarkup,
        onAction: this.togglePopover,
        content: activatorLabel,
        disabled: disabled,
        indicator: this.isNewBadgeInBadgeActions()
      }),
      preferredAlignment: "right",
      onClose: this.togglePopover
    }, /*#__PURE__*/React.createElement(ActionList.ActionList, {
      sections: combinedActions,
      onActionAnyItem: this.togglePopover
    }))) : null;
    const groupContent = promotedActionsMarkup || actionsPopover ? /*#__PURE__*/React.createElement(HorizontalStack.HorizontalStack, {
      gap: "3"
    }, promotedActionsMarkup, actionsPopover) : null;
    if (!groupContent) {
      return null;
    }
    const group = /*#__PURE__*/React.createElement(reactTransitionGroup.Transition, {
      timeout: 100,
      in: selectMode,
      key: "group",
      nodeRef: this.groupNode
    }, status => {
      const groupClassName = css.classNames(BulkActions$1.default.Group, !isSticky && BulkActions$1.default['Group-not-sticky'], !measuring && isSticky && BulkActions$1.default[`Group-${status}`], measuring && BulkActions$1.default['Group-measuring']);
      return /*#__PURE__*/React.createElement("div", {
        className: groupClassName,
        ref: this.groupNode,
        style: {
          width
        }
      }, /*#__PURE__*/React.createElement(EventListener.EventListener, {
        event: "resize",
        handler: this.handleResize
      }), /*#__PURE__*/React.createElement("div", {
        className: BulkActions$1.default.ButtonGroupWrapper,
        ref: this.setButtonsNode
      }, /*#__PURE__*/React.createElement("div", {
        className: BulkActions$1.default.ButtonGroupInner
      }, groupContent)));
    });
    return /*#__PURE__*/React.createElement("div", {
      ref: this.setContainerNode
    }, group);
  }
  isNewBadgeInBadgeActions() {
    const actions = this.actionSections();
    if (!actions) return false;
    for (const action of actions) {
      for (const item of action.items) {
        if (item.badge?.status === 'new') return true;
      }
    }
    return false;
  }
}
function instanceOfBulkActionListSectionArray(actions) {
  const validList = actions.filter(action => {
    return action.items;
  });
  return actions.length === validList.length;
}
function instanceOfBulkActionArray(actions) {
  const validList = actions.filter(action => {
    return !action.items;
  });
  return actions.length === validList.length;
}
function instanceOfMenuGroupDescriptor(action) {
  return 'title' in action;
}
function BulkActions(props) {
  const i18n = hooks.useI18n();
  return /*#__PURE__*/React.createElement(BulkActionsInner, Object.assign({}, props, {
    i18n: i18n
  }));
}

exports.BulkActions = BulkActions;
