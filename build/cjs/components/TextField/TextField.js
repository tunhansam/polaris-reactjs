'use strict';

var React = require('react');
var polarisIcons = require('@shopify/polaris-icons');
var css = require('../../utilities/css.js');
var useIsAfterInitialMount = require('../../utilities/use-is-after-initial-mount.js');
var types = require('../../types.js');
var useEventListener = require('../../utilities/use-event-listener.js');
var TextField$1 = require('./TextField.scss.js');
var Spinner = require('./components/Spinner/Spinner.js');
var Labelled = require('../Labelled/Labelled.js');
var Connected = require('../Connected/Connected.js');
var Resizer = require('./components/Resizer/Resizer.js');
var Label = require('../Label/Label.js');
var hooks = require('../../utilities/i18n/hooks.js');
var Text = require('../Text/Text.js');
var Icon = require('../Icon/Icon.js');

function TextField({
  prefix,
  suffix,
  verticalContent,
  placeholder,
  value = '',
  helpText,
  label,
  labelAction,
  labelHidden,
  disabled,
  clearButton,
  readOnly,
  autoFocus,
  focused,
  multiline,
  error,
  connectedRight,
  connectedLeft,
  type = 'text',
  name,
  id: idProp,
  role,
  step,
  largeStep,
  autoComplete,
  max,
  maxLength,
  maxHeight,
  min,
  minLength,
  pattern,
  inputMode,
  spellCheck,
  ariaOwns,
  ariaControls,
  ariaExpanded,
  ariaActiveDescendant,
  ariaAutocomplete,
  showCharacterCount,
  align,
  requiredIndicator,
  monospaced,
  selectTextOnFocus,
  suggestion,
  onClearButtonClick,
  onChange,
  onSpinnerChange,
  onFocus,
  onBlur,
  borderless
}) {
  const i18n = hooks.useI18n();
  const [height, setHeight] = React.useState(null);
  const [focus, setFocus] = React.useState(Boolean(focused));
  const isAfterInitial = useIsAfterInitialMount.useIsAfterInitialMount();
  const uniqId = React.useId();
  const id = idProp ?? uniqId;
  const inputRef = React.useRef(null);
  const textAreaRef = React.useRef(null);
  const prefixRef = React.useRef(null);
  const suffixRef = React.useRef(null);
  const verticalContentRef = React.useRef(null);
  const buttonPressTimer = React.useRef();
  const spinnerRef = React.useRef(null);
  React.useEffect(() => {
    const input = multiline ? textAreaRef.current : inputRef.current;
    if (!input || focused === undefined) return;
    focused ? input.focus() : input.blur();
  }, [focused, verticalContent, multiline]);
  React.useEffect(() => {
    const input = inputRef.current;
    const isSupportedInputType = type === 'text' || type === 'tel' || type === 'search' || type === 'url' || type === 'password';
    if (!input || !isSupportedInputType || !suggestion) {
      return;
    }
    input.setSelectionRange(value.length, suggestion.length);
  }, [focus, value, type, suggestion]);
  const normalizedValue = suggestion ? suggestion : value;
  const normalizedStep = step != null ? step : 1;
  const normalizedMax = max != null ? max : Infinity;
  const normalizedMin = min != null ? min : -Infinity;
  const className = css.classNames(TextField$1.default.TextField, Boolean(normalizedValue) && TextField$1.default.hasValue, disabled && TextField$1.default.disabled, readOnly && TextField$1.default.readOnly, error && TextField$1.default.error, multiline && TextField$1.default.multiline, focus && !disabled && TextField$1.default.focus, borderless && TextField$1.default.borderless);
  const inputType = type === 'currency' ? 'text' : type;
  const isNumericType = type === 'number' || type === 'integer';
  const prefixMarkup = prefix ? /*#__PURE__*/React.createElement("div", {
    className: TextField$1.default.Prefix,
    id: `${id}-Prefix`,
    ref: prefixRef
  }, prefix) : null;
  const suffixMarkup = suffix ? /*#__PURE__*/React.createElement("div", {
    className: TextField$1.default.Suffix,
    id: `${id}-Suffix`,
    ref: suffixRef
  }, suffix) : null;
  let characterCountMarkup = null;
  if (showCharacterCount) {
    const characterCount = normalizedValue.length;
    const characterCountLabel = maxLength ? i18n.translate('Polaris.TextField.characterCountWithMaxLength', {
      count: characterCount,
      limit: maxLength
    }) : i18n.translate('Polaris.TextField.characterCount', {
      count: characterCount
    });
    const characterCountClassName = css.classNames(TextField$1.default.CharacterCount, multiline && TextField$1.default.AlignFieldBottom);
    const characterCountText = !maxLength ? characterCount : `${characterCount}/${maxLength}`;
    characterCountMarkup = /*#__PURE__*/React.createElement("div", {
      id: `${id}-CharacterCounter`,
      className: characterCountClassName,
      "aria-label": characterCountLabel,
      "aria-live": focus ? 'polite' : 'off',
      "aria-atomic": "true",
      onClick: handleClickChild
    }, characterCountText);
  }
  const clearButtonVisible = normalizedValue !== '';
  const clearButtonMarkup = clearButton && clearButtonVisible ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: TextField$1.default.ClearButton,
    onClick: handleClearButtonPress,
    disabled: disabled
  }, /*#__PURE__*/React.createElement(Text.Text, {
    as: "span",
    visuallyHidden: true
  }, i18n.translate('Polaris.Common.clear')), /*#__PURE__*/React.createElement(Icon.Icon, {
    source: polarisIcons.CircleCancelMinor,
    color: "base"
  })) : null;
  const handleNumberChange = React.useCallback((steps, stepAmount = normalizedStep) => {
    if (onChange == null && onSpinnerChange == null) {
      return;
    }
    // Returns the length of decimal places in a number
    const dpl = num => (num.toString().split('.')[1] || []).length;
    const numericValue = value ? parseFloat(value) : 0;
    if (isNaN(numericValue)) {
      return;
    }

    // Making sure the new value has the same length of decimal places as the
    // step / value has.
    const decimalPlaces = type === 'integer' ? 0 : Math.max(dpl(numericValue), dpl(stepAmount));
    const newValue = Math.min(Number(normalizedMax), Math.max(numericValue + steps * stepAmount, Number(normalizedMin)));
    if (onSpinnerChange != null) {
      onSpinnerChange(String(newValue.toFixed(decimalPlaces)), id);
    } else if (onChange != null) {
      onChange(String(newValue.toFixed(decimalPlaces)), id);
    }
  }, [id, normalizedMax, normalizedMin, onChange, onSpinnerChange, normalizedStep, type, value]);
  const handleButtonRelease = React.useCallback(() => {
    clearTimeout(buttonPressTimer.current);
  }, []);
  const handleButtonPress = React.useCallback(onChange => {
    const minInterval = 50;
    const decrementBy = 10;
    let interval = 200;
    const onChangeInterval = () => {
      if (interval > minInterval) interval -= decrementBy;
      onChange(0);
      buttonPressTimer.current = window.setTimeout(onChangeInterval, interval);
    };
    buttonPressTimer.current = window.setTimeout(onChangeInterval, interval);
    document.addEventListener('mouseup', handleButtonRelease, {
      once: true
    });
  }, [handleButtonRelease]);
  const spinnerMarkup = isNumericType && step !== 0 && !disabled && !readOnly ? /*#__PURE__*/React.createElement(Spinner.Spinner, {
    onClick: handleClickChild,
    onChange: handleNumberChange,
    onMouseDown: handleButtonPress,
    onMouseUp: handleButtonRelease,
    ref: spinnerRef,
    onBlur: handleOnBlur
  }) : null;
  const style = multiline && height ? {
    height,
    maxHeight
  } : null;
  const handleExpandingResize = React.useCallback(height => {
    setHeight(height);
  }, []);
  const resizer = multiline && isAfterInitial ? /*#__PURE__*/React.createElement(Resizer.Resizer, {
    contents: normalizedValue || placeholder,
    currentHeight: height,
    minimumLines: typeof multiline === 'number' ? multiline : 1,
    onHeightChange: handleExpandingResize
  }) : null;
  const describedBy = [];
  if (error) {
    describedBy.push(`${id}Error`);
  }
  if (helpText) {
    describedBy.push(Labelled.helpTextID(id));
  }
  if (showCharacterCount) {
    describedBy.push(`${id}-CharacterCounter`);
  }
  const labelledBy = [];
  if (prefix) {
    labelledBy.push(`${id}-Prefix`);
  }
  if (suffix) {
    labelledBy.push(`${id}-Suffix`);
  }
  if (verticalContent) {
    labelledBy.push(`${id}-VerticalContent`);
  }
  labelledBy.unshift(Label.labelID(id));
  const inputClassName = css.classNames(TextField$1.default.Input, align && TextField$1.default[css.variationName('Input-align', align)], suffix && TextField$1.default['Input-suffixed'], clearButton && TextField$1.default['Input-hasClearButton'], monospaced && TextField$1.default.monospaced, suggestion && TextField$1.default.suggestion);
  const handleOnFocus = event => {
    setFocus(true);
    if (selectTextOnFocus && !suggestion) {
      const input = multiline ? textAreaRef.current : inputRef.current;
      input?.select();
    }
    if (onFocus) {
      onFocus(event);
    }
  };
  useEventListener.useEventListener('wheel', handleOnWheel, inputRef);
  function handleOnWheel(event) {
    if (document.activeElement === event.target && isNumericType) {
      event.stopPropagation();
    }
  }
  const input = /*#__PURE__*/React.createElement(multiline ? 'textarea' : 'input', {
    name,
    id,
    disabled,
    readOnly,
    role,
    autoFocus,
    value: normalizedValue,
    placeholder,
    style,
    autoComplete,
    className: inputClassName,
    ref: multiline ? textAreaRef : inputRef,
    min,
    max,
    step,
    minLength,
    maxLength,
    spellCheck,
    pattern,
    inputMode,
    type: inputType,
    rows: getRows(multiline),
    'aria-describedby': describedBy.length ? describedBy.join(' ') : undefined,
    'aria-labelledby': labelledBy.join(' '),
    'aria-invalid': Boolean(error),
    'aria-owns': ariaOwns,
    'aria-activedescendant': ariaActiveDescendant,
    'aria-autocomplete': ariaAutocomplete,
    'aria-controls': ariaControls,
    'aria-expanded': ariaExpanded,
    'aria-required': requiredIndicator,
    ...normalizeAriaMultiline(multiline),
    onFocus: handleOnFocus,
    onBlur: handleOnBlur,
    onClick: handleClickChild,
    onKeyPress: handleKeyPress,
    onKeyDown: handleKeyDown,
    onChange: !suggestion ? handleChange : undefined,
    onInput: suggestion ? handleChange : undefined
  });
  const inputWithVerticalContentMarkup = verticalContent ? /*#__PURE__*/React.createElement("div", {
    className: TextField$1.default.VerticalContent,
    id: `${id}-VerticalContent`,
    ref: verticalContentRef,
    onClick: handleClickChild
  }, verticalContent, input) : null;
  const inputMarkup = verticalContent ? inputWithVerticalContentMarkup : input;
  const backdropMarkup = /*#__PURE__*/React.createElement("div", {
    className: css.classNames(TextField$1.default.Backdrop, connectedLeft && TextField$1.default['Backdrop-connectedLeft'], connectedRight && TextField$1.default['Backdrop-connectedRight'])
  });
  return /*#__PURE__*/React.createElement(Labelled.Labelled, {
    label: label,
    id: id,
    error: error,
    action: labelAction,
    labelHidden: labelHidden,
    helpText: helpText,
    requiredIndicator: requiredIndicator,
    disabled: disabled,
    readOnly: readOnly
  }, /*#__PURE__*/React.createElement(Connected.Connected, {
    left: connectedLeft,
    right: connectedRight
  }, /*#__PURE__*/React.createElement("div", {
    className: className,
    onClick: handleClick
  }, prefixMarkup, inputMarkup, suffixMarkup, characterCountMarkup, clearButtonMarkup, spinnerMarkup, backdropMarkup, resizer)));
  function handleChange(event) {
    onChange && onChange(event.currentTarget.value, id);
  }
  function handleClick(event) {
    const {
      target
    } = event;

    // For TextFields used with Combobox, focus needs to be set again even
    // if the TextField is already focused to trigger the logic to open the
    // Combobox activator
    const inputRefRole = inputRef?.current?.getAttribute('role');
    if (target === inputRef.current && inputRefRole === 'combobox') {
      inputRef.current?.focus();
      handleOnFocus(event);
      return;
    }
    if (isPrefixOrSuffix(target) || isVerticalContent(target) || isInput(target) || isSpinner(target) || focus) {
      return;
    }
    inputRef.current?.focus();
  }
  function handleClickChild(event) {
    if (!isSpinner(event.target) && !isInput(event.target)) {
      event.stopPropagation();
    }
    if (isPrefixOrSuffix(event.target) || isVerticalContent(event.target) || isInput(event.target) || focus) {
      return;
    }
    setFocus(true);
  }
  function handleClearButtonPress() {
    onClearButtonClick && onClearButtonClick(id);
  }
  function handleKeyPress(event) {
    const {
      key,
      which
    } = event;
    const numbersSpec = /[\d.,eE+-]$/;
    const integerSpec = /[\deE+-]$/;
    if (!isNumericType || which === types.Key.Enter || type === 'number' && numbersSpec.test(key) || type === 'integer' && integerSpec.test(key)) {
      return;
    }
    event.preventDefault();
  }
  function handleKeyDown(event) {
    if (!isNumericType) {
      return;
    }
    const {
      key,
      which
    } = event;
    if (type === 'integer' && (key === 'ArrowUp' || which === types.Key.UpArrow)) {
      handleNumberChange(1);
      event.preventDefault();
    }
    if (type === 'integer' && (key === 'ArrowDown' || which === types.Key.DownArrow)) {
      handleNumberChange(-1);
      event.preventDefault();
    }
    if ((which === types.Key.Home || key === 'Home') && min !== undefined) {
      if (onSpinnerChange != null) {
        onSpinnerChange(String(min), id);
      } else if (onChange != null) {
        onChange(String(min), id);
      }
    }
    if ((which === types.Key.End || key === 'End') && max !== undefined) {
      if (onSpinnerChange != null) {
        onSpinnerChange(String(max), id);
      } else if (onChange != null) {
        onChange(String(max), id);
      }
    }
    if ((which === types.Key.PageUp || key === 'PageUp') && largeStep !== undefined) {
      handleNumberChange(1, largeStep);
    }
    if ((which === types.Key.PageDown || key === 'PageDown') && largeStep !== undefined) {
      handleNumberChange(-1, largeStep);
    }
  }
  function handleOnBlur(event) {
    setFocus(false);
    if (onBlur) {
      onBlur(event);
    }
  }
  function isInput(target) {
    return target instanceof HTMLElement && inputRef.current && (inputRef.current.contains(target) || inputRef.current.contains(document.activeElement));
  }
  function isPrefixOrSuffix(target) {
    return target instanceof Element && (prefixRef.current && prefixRef.current.contains(target) || suffixRef.current && suffixRef.current.contains(target));
  }
  function isSpinner(target) {
    return target instanceof Element && spinnerRef.current && spinnerRef.current.contains(target);
  }
  function isVerticalContent(target) {
    return target instanceof Element && verticalContentRef.current && (verticalContentRef.current.contains(target) || verticalContentRef.current.contains(document.activeElement));
  }
}
function getRows(multiline) {
  if (!multiline) return undefined;
  return typeof multiline === 'number' ? multiline : 1;
}
function normalizeAriaMultiline(multiline) {
  if (!multiline) return undefined;
  return Boolean(multiline) || typeof multiline === 'number' && multiline > 0 ? {
    'aria-multiline': true
  } : undefined;
}

exports.TextField = TextField;
