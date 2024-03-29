'use strict';

var React = require('react');
var shared = require('../shared.js');
var hooks = require('../../utilities/link/hooks.js');

// Wrapping forwardRef in a memo gets a name set since
// https://github.com/facebook/react/issues/16722
// but eslint-plugin-react doesn't know that just yet
// eslint-disable-next-line react/display-name
const UnstyledLink = /*#__PURE__*/React.memo( /*#__PURE__*/React.forwardRef(function UnstyledLink(props, _ref) {
  const LinkComponent = hooks.useLink();
  if (LinkComponent) {
    return /*#__PURE__*/React.createElement(LinkComponent, Object.assign({}, shared.unstyled.props, props, {
      ref: _ref
    }));
  }
  const {
    external,
    url,
    target: targetProp,
    ...rest
  } = props;
  let target;
  if (external) {
    target = '_blank';
  } else {
    target = targetProp ?? undefined;
  }
  const rel = target === '_blank' ? 'noopener noreferrer' : undefined;
  return /*#__PURE__*/React.createElement("a", Object.assign({
    target: target
  }, rest, {
    href: url,
    rel: rel
  }, shared.unstyled.props, {
    ref: _ref
  }));
}));

exports.UnstyledLink = UnstyledLink;
