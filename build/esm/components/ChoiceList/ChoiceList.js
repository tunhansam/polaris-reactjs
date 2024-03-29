import React, { useId } from 'react';
import styles from './ChoiceList.scss.js';
import { Bleed } from '../Bleed/Bleed.js';
import { RadioButton } from '../RadioButton/RadioButton.js';
import { Box } from '../Box/Box.js';
import { errorTextID, InlineError } from '../InlineError/InlineError.js';
import { VerticalStack } from '../VerticalStack/VerticalStack.js';
import { Checkbox } from '../Checkbox/Checkbox.js';

function ChoiceList({
  title,
  titleHidden,
  allowMultiple,
  choices,
  selected,
  onChange = noop,
  error,
  disabled = false,
  name: nameProp
}) {
  // Type asserting to any is required for TS3.2 but can be removed when we update to 3.3
  // see https://github.com/Microsoft/TypeScript/issues/28768
  const ControlComponent = allowMultiple ? Checkbox : RadioButton;
  const uniqName = useId();
  const name = nameProp ?? uniqName;
  const finalName = allowMultiple ? `${name}[]` : name;
  const titleMarkup = title ? /*#__PURE__*/React.createElement(Box, {
    as: "legend",
    paddingBlockEnd: {
      xs: '5',
      md: '1'
    },
    visuallyHidden: titleHidden
  }, title) : null;
  const choicesMarkup = choices.map(choice => {
    const {
      value,
      id,
      label,
      helpText,
      disabled: choiceDisabled,
      describedByError
    } = choice;
    function handleChange(checked) {
      onChange(updateSelectedChoices(choice, checked, selected, allowMultiple), name);
    }
    const isSelected = choiceIsSelected(choice, selected);
    const renderedChildren = choice.renderChildren ? choice.renderChildren(isSelected) : null;
    const children = renderedChildren ? /*#__PURE__*/React.createElement("div", {
      className: styles.ChoiceChildren
    }, /*#__PURE__*/React.createElement(Box, {
      paddingBlockStart: {
        xs: '4',
        md: '0'
      }
    }, renderedChildren)) : null;
    return /*#__PURE__*/React.createElement("li", {
      key: value
    }, /*#__PURE__*/React.createElement(Bleed, {
      marginBlockEnd: helpText ? {
        xs: '1',
        md: '0'
      } : {
        xs: '0'
      }
    }, /*#__PURE__*/React.createElement(ControlComponent, {
      name: finalName,
      value: value,
      id: id,
      label: label,
      disabled: choiceDisabled || disabled,
      fill: {
        xs: true,
        sm: false
      },
      checked: choiceIsSelected(choice, selected),
      helpText: helpText,
      onChange: handleChange,
      ariaDescribedBy: error && describedByError ? errorTextID(finalName) : null
    }), children));
  });
  const errorMarkup = error && /*#__PURE__*/React.createElement(Box, {
    paddingBlockStart: {
      xs: '0',
      md: '1'
    },
    paddingBlockEnd: "2"
  }, /*#__PURE__*/React.createElement(InlineError, {
    message: error,
    fieldID: finalName
  }));
  return /*#__PURE__*/React.createElement(VerticalStack, {
    as: "fieldset",
    gap: {
      xs: '4',
      md: '0'
    },
    "aria-invalid": error != null,
    id: finalName
  }, titleMarkup, /*#__PURE__*/React.createElement(VerticalStack, {
    as: "ul",
    gap: {
      xs: '4',
      md: '0'
    }
  }, choicesMarkup), errorMarkup);
}
function noop() {}
function choiceIsSelected({
  value
}, selected) {
  return selected.includes(value);
}
function updateSelectedChoices({
  value
}, checked, selected, allowMultiple = false) {
  if (checked) {
    return allowMultiple ? [...selected, value] : [value];
  }
  return selected.filter(selectedChoice => selectedChoice !== value);
}

export { ChoiceList };
