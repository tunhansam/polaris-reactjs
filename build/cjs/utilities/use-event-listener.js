'use strict';

var React = require('react');
var useIsomorphicLayoutEffect = require('./use-isomorphic-layout-effect.js');

/**
 * Acceptable target elements for `useEventListener`.
 */

/**
 * React hook encapsulating the boilerplate logic for adding and removing event listeners.
 */
function useEventListener(eventName, handler, target, options) {
  const handlerRef = React.useRef(handler);
  const optionsRef = React.useRef(options);
  useIsomorphicLayoutEffect.useIsomorphicLayoutEffect(() => {
    handlerRef.current = handler;
  }, [handler]);
  useIsomorphicLayoutEffect.useIsomorphicLayoutEffect(() => {
    optionsRef.current = options;
  }, [options]);
  React.useEffect(() => {
    if (!(typeof eventName === 'string' && target !== null)) return;
    let targetElement;
    if (typeof target === 'undefined') {
      targetElement = window;
    } else if ('current' in target) {
      if (target.current === null) return;
      targetElement = target.current;
    } else {
      targetElement = target;
    }
    const eventOptions = optionsRef.current;
    const eventListener = event => handlerRef.current(event);
    targetElement.addEventListener(eventName, eventListener, eventOptions);
    return () => {
      targetElement.removeEventListener(eventName, eventListener, eventOptions);
    };
  }, [eventName, target]);
}

exports.useEventListener = useEventListener;
