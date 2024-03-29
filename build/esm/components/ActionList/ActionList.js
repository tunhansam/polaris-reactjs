import React, { useRef } from 'react';
import { wrapFocusPreviousFocusableMenuItem, wrapFocusNextFocusableMenuItem } from '../../utilities/focus.js';
import { Key } from '../../types.js';
import { Section } from './components/Section/Section.js';
import { KeypressListener } from '../KeypressListener/KeypressListener.js';
import { Box } from '../Box/Box.js';
import { Item } from './components/Item/Item.js';

function ActionList({
  items,
  sections = [],
  actionRole,
  onActionAnyItem
}) {
  let finalSections = [];
  const actionListRef = useRef(null);
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
    return section.items.length > 0 ? /*#__PURE__*/React.createElement(Section, {
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
        wrapFocusPreviousFocusableMenuItem(actionListRef.current, evt.target);
      }
    }
  };
  const handleFocusNextItem = evt => {
    evt.preventDefault();
    if (actionListRef.current && evt.target) {
      if (actionListRef.current.contains(evt.target)) {
        wrapFocusNextFocusableMenuItem(actionListRef.current, evt.target);
      }
    }
  };
  const listeners = actionRole === 'menuitem' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(KeypressListener, {
    keyEvent: "keydown",
    keyCode: Key.DownArrow,
    handler: handleFocusNextItem
  }), /*#__PURE__*/React.createElement(KeypressListener, {
    keyEvent: "keydown",
    keyCode: Key.UpArrow,
    handler: handleFocusPreviousItem
  })) : null;
  return /*#__PURE__*/React.createElement(Box, {
    as: hasMultipleSections ? 'ul' : 'div',
    ref: actionListRef,
    role: elementRole,
    tabIndex: elementTabIndex
  }, listeners, sectionMarkup);
}
ActionList.Item = Item;

export { ActionList };
