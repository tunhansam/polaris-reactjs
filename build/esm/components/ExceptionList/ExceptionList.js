import React, { Fragment } from 'react';
import { classNames, variationName } from '../../utilities/css.js';
import styles from './ExceptionList.scss.js';
import { Truncate } from '../Truncate/Truncate.js';
import { Icon } from '../Icon/Icon.js';

function ExceptionList({
  items: itemsList
}) {
  const items = itemsList.map((item, index) => {
    const {
      status,
      icon,
      title,
      description,
      truncate = false
    } = item;
    const itemClasses = classNames(styles.Item, status && styles[variationName('status', status)]);
    const iconMarkup = icon ? /*#__PURE__*/React.createElement(Icon, {
      source: icon
    }) : /*#__PURE__*/React.createElement("span", {
      className: styles.Bullet
    });
    const titleMarkup = title && /*#__PURE__*/React.createElement("span", {
      className: styles.Title
    }, title);
    const descriptionMarkup = description && /*#__PURE__*/React.createElement("span", {
      className: styles.Description
    }, description);
    const Element = truncate ? Truncate : Fragment;
    return /*#__PURE__*/React.createElement("li", {
      className: itemClasses,
      key: index
    }, /*#__PURE__*/React.createElement("span", {
      className: styles.Icon
    }, iconMarkup), /*#__PURE__*/React.createElement(Element, null, titleMarkup, descriptionMarkup));
  });
  return /*#__PURE__*/React.createElement("ul", {
    className: styles.ExceptionList
  }, items);
}

export { ExceptionList };
