'use strict';

var React = require('react');
require('./AppProvider.scss.js');
require('./global.scss.js');
var context = require('../../utilities/features/context.js');
var stickyManager = require('../../utilities/sticky-manager/sticky-manager.js');
var scrollLockManager = require('../../utilities/scroll-lock-manager/scroll-lock-manager.js');
var I18n = require('../../utilities/i18n/I18n.js');
var context$1 = require('../../utilities/i18n/context.js');
var context$2 = require('../../utilities/scroll-lock-manager/context.js');
var context$3 = require('../../utilities/sticky-manager/context.js');
var context$4 = require('../../utilities/link/context.js');
var MediaQueryProvider = require('../MediaQueryProvider/MediaQueryProvider.js');
var PortalsManager = require('../PortalsManager/PortalsManager.js');
var FocusManager = require('../FocusManager/FocusManager.js');
var EphemeralPresenceManager = require('../EphemeralPresenceManager/EphemeralPresenceManager.js');

class AppProvider extends React.Component {
  constructor(props) {
    super(props);
    this.setBodyStyles = () => {
      document.body.style.backgroundColor = 'var(--p-color-bg-app)';
      document.body.style.color = 'var(--p-color-text)';
    };
    this.setRootAttributes = () => {
      const features = this.getFeatures();
      document.documentElement.classList.toggle(context.classNamePolarisSummerEditions2023, features.polarisSummerEditions2023);
      document.documentElement.classList.toggle(context.classNamePolarisSummerEditions2023ShadowBevelOptOut, features.polarisSummerEditions2023ShadowBevelOptOut);
    };
    this.getFeatures = () => {
      const {
        features
      } = this.props;
      return {
        ...features,
        polarisSummerEditions2023: features?.polarisSummerEditions2023 ?? false,
        polarisSummerEditions2023ShadowBevelOptOut: features?.polarisSummerEditions2023ShadowBevelOptOut ?? false
      };
    };
    this.stickyManager = new stickyManager.StickyManager();
    this.scrollLockManager = new scrollLockManager.ScrollLockManager();
    const {
      i18n,
      linkComponent
    } = this.props;

    // eslint-disable-next-line react/state-in-constructor
    this.state = {
      link: linkComponent,
      intl: new I18n.I18n(i18n)
    };
  }
  componentDidMount() {
    if (document != null) {
      this.stickyManager.setContainer(document);
      this.setBodyStyles();
      this.setRootAttributes();
    }
  }
  componentDidUpdate({
    i18n: prevI18n,
    linkComponent: prevLinkComponent
  }) {
    const {
      i18n,
      linkComponent
    } = this.props;
    this.setRootAttributes();
    if (i18n === prevI18n && linkComponent === prevLinkComponent) {
      return;
    }
    this.setState({
      link: linkComponent,
      intl: new I18n.I18n(i18n)
    });
  }
  render() {
    const {
      children
    } = this.props;
    const features = this.getFeatures();
    const {
      intl,
      link
    } = this.state;
    return /*#__PURE__*/React.createElement(context.FeaturesContext.Provider, {
      value: features
    }, /*#__PURE__*/React.createElement(context$1.I18nContext.Provider, {
      value: intl
    }, /*#__PURE__*/React.createElement(context$2.ScrollLockManagerContext.Provider, {
      value: this.scrollLockManager
    }, /*#__PURE__*/React.createElement(context$3.StickyManagerContext.Provider, {
      value: this.stickyManager
    }, /*#__PURE__*/React.createElement(context$4.LinkContext.Provider, {
      value: link
    }, /*#__PURE__*/React.createElement(MediaQueryProvider.MediaQueryProvider, null, /*#__PURE__*/React.createElement(PortalsManager.PortalsManager, null, /*#__PURE__*/React.createElement(FocusManager.FocusManager, null, /*#__PURE__*/React.createElement(EphemeralPresenceManager.EphemeralPresenceManager, null, children)))))))));
  }
}

exports.AppProvider = AppProvider;
