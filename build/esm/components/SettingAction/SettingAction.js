import React from 'react';
import styles from './SettingAction.scss.js';

function SettingAction({
  action,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: styles.SettingAction
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.Setting
  }, children), /*#__PURE__*/React.createElement("div", {
    className: styles.Action
  }, action));
}

export { SettingAction };
