import React, { Component } from 'react';
import './AppProvider.scss.js';
import './global.scss.js';
import { classNamePolarisSummerEditions2023, classNamePolarisSummerEditions2023ShadowBevelOptOut, FeaturesContext } from '../../utilities/features/context.js';
import { StickyManager } from '../../utilities/sticky-manager/sticky-manager.js';
import { ScrollLockManager } from '../../utilities/scroll-lock-manager/scroll-lock-manager.js';
import { I18n } from '../../utilities/i18n/I18n.js';
import { I18nContext } from '../../utilities/i18n/context.js';
import { ScrollLockManagerContext } from '../../utilities/scroll-lock-manager/context.js';
import { StickyManagerContext } from '../../utilities/sticky-manager/context.js';
import { LinkContext } from '../../utilities/link/context.js';
import { MediaQueryProvider } from '../MediaQueryProvider/MediaQueryProvider.js';
import { PortalsManager } from '../PortalsManager/PortalsManager.js';
import { FocusManager } from '../FocusManager/FocusManager.js';
import { EphemeralPresenceManager } from '../EphemeralPresenceManager/EphemeralPresenceManager.js';

class AppProvider extends Component {
  constructor(props) {
    super(props);
    this.setBodyStyles = () => {
      document.body.style.backgroundColor = 'var(--p-color-bg-app)';
      document.body.style.color = 'var(--p-color-text)';
    };
    this.setRootAttributes = () => {
      const features = this.getFeatures();
      document.documentElement.classList.toggle(classNamePolarisSummerEditions2023, features.polarisSummerEditions2023);
      document.documentElement.classList.toggle(classNamePolarisSummerEditions2023ShadowBevelOptOut, features.polarisSummerEditions2023ShadowBevelOptOut);
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
    this.stickyManager = new StickyManager();
    this.scrollLockManager = new ScrollLockManager();
    const {
      i18n,
      linkComponent
    } = this.props;

    // eslint-disable-next-line react/state-in-constructor
    this.state = {
      link: linkComponent,
      intl: new I18n(i18n)
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
      intl: new I18n(i18n)
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
    return /*#__PURE__*/React.createElement(FeaturesContext.Provider, {
      value: features
    }, /*#__PURE__*/React.createElement(I18nContext.Provider, {
      value: intl
    }, /*#__PURE__*/React.createElement(ScrollLockManagerContext.Provider, {
      value: this.scrollLockManager
    }, /*#__PURE__*/React.createElement(StickyManagerContext.Provider, {
      value: this.stickyManager
    }, /*#__PURE__*/React.createElement(LinkContext.Provider, {
      value: link
    }, /*#__PURE__*/React.createElement(MediaQueryProvider, null, /*#__PURE__*/React.createElement(PortalsManager, null, /*#__PURE__*/React.createElement(FocusManager, null, /*#__PURE__*/React.createElement(EphemeralPresenceManager, null, children)))))))));
  }
}

export { AppProvider };
