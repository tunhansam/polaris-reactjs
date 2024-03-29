'use strict';

var React = require('react');
var focus = require('../../utilities/focus.js');
var types = require('../../types.js');
var Section = require('./components/Section/Section.js');
var KeypressListener = require('../KeypressListener/KeypressListener.js');
var Box = require('../Box/Box.js');
var Item = require('./components/Item/Item.js');

function ActionList({
  items,
  sections = [],
  actionRole,
  onActionAnyItem
}) {
  let finalSections = [];
  const actionListRef = React.useRef(null);
  if (items) {
    finalSections = [{
      items
    }, ...sections];
  } else if (sections) {
    finalSections = sections;
  }
  const hasMultipleSections = finalSections.length > 1;
  const elementRole = hasMultipleSections && actionRole === 'menuitem' ? 'menu' : undefined;
  const elementTabIndex = hasMultipleSections && actionRole === 'menuitem' ? -1 : undefined;
  const sectionMarkup = finalSections.map((section, index) => {
    return section.items.length > 0 ? /*#__PURE__*/React.createElement(Section.Section, {
      key: typeof section.title === 'string' ? section.title : index,
      section: section,
      hasMultipleSections: hasMultipleSections,
      actionRole: actionRole,
      onActionAnyItem: onActionAnyItem,
      isFirst: index === 0
    }) : null;
  });
  const handleFocusPreviousItem = evt => {
    evt.preventDefault();
    if (actionListRef.current && evt.target) {
      if (actionListRef.current.contains(evt.target)) {
        focus.wrapFocusPreviousFocusableMenuItem(actionListRef.current, evt.target);
      }
    }
  };
  const handleFocusNextItem = evt => {
    evt.preventDefault();
    if (actionListRef.current && evt.target) {
      if (actionListRef.current.contains(evt.target)) {
        focus.wrapFocusNextFocusableMenuItem(actionListRef.current, evt.target);
      }
    }
  };
  const listeners = actionRole === 'menuitem' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(KeypressListener.KeypressListener, {
    keyEvent: "keydown",
    keyCode: types.Key.DownArrow,
    handler: handleFocusNextItem
  }), /*#__PURE__*/React.createElement(KeypressListener.KeypressListener, {
    keyEvent: "keydown",
    keyCode: types.Key.UpArrow,
    handler: handleFocusPreviousItem
  })) : null;
  return /*#__PURE__*/React.createElement(Box.Box, {
    as: hasMultipleSections ? 'ul' : 'div',
    ref: actionListRef,
    role: elementRole,
    tabIndex: elementTabIndex
  }, listeners, sectionMarkup);
}
ActionList.Item = Item.Item;

exports.ActionList = ActionList;
