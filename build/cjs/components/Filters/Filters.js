'use strict';

var React = require('react');
var polarisIcons = require('@shopify/polaris-icons');
var css = require('../../utilities/css.js');
var breakpoints = require('../../utilities/breakpoints.js');
var Filters$1 = require('./Filters.scss.js');
var SearchField = require('./components/SearchField/SearchField.js');
var FilterPill = require('./components/FilterPill/FilterPill.js');
var hooks = require('../../utilities/i18n/hooks.js');
var hooks$1 = require('../../utilities/features/hooks.js');
var UnstyledButton = require('../UnstyledButton/UnstyledButton.js');
var Text = require('../Text/Text.js');
var Spinner = require('../Spinner/Spinner.js');
var Box = require('../Box/Box.js');
var HorizontalStack = require('../HorizontalStack/HorizontalStack.js');
var Popover = require('../Popover/Popover.js');
var ActionList = require('../ActionList/ActionList.js');
var Button = require('../Button/Button.js');

const TRANSITION_DURATION = 'var(--p-motion-duration-150)';
const TRANSITION_MARGIN = '-36px';
const defaultStyle = {
  transition: `opacity ${TRANSITION_DURATION} var(--p-motion-ease)`,
  opacity: 0
};
const transitionStyles = {
  entering: {
    opacity: 1
  },
  entered: {
    opacity: 1
  },
  exiting: {
    opacity: 0
  },
  exited: {
    opacity: 0
  },
  unmounted: {
    opacity: 0
  }
};
const defaultFilterStyles = {
  transition: `opacity ${TRANSITION_DURATION} var(--p-motion-ease), margin ${TRANSITION_DURATION} var(--p-motion-ease)`,
  opacity: 0,
  marginTop: TRANSITION_MARGIN
};
const transitionFilterStyles = {
  entering: {
    opacity: 1,
    marginTop: 0
  },
  entered: {
    opacity: 1,
    marginTop: 0
  },
  exiting: {
    opacity: 0,
    marginTop: TRANSITION_MARGIN
  },
  exited: {
    opacity: 0,
    marginTop: TRANSITION_MARGIN
  },
  unmounted: {
    opacity: 0,
    marginTop: TRANSITION_MARGIN
  }
};
function Filters({
  queryValue,
  queryPlaceholder,
  focused,
  filters,
  appliedFilters,
  onQueryChange,
  onQueryClear,
  onQueryBlur,
  onQueryFocus,
  onClearAll,
  children,
  disabled,
  hideFilters,
  hideQueryField,
  disableQueryField,
  borderlessQueryField,
  loading,
  disableFilters,
  mountedState,
  onAddFilterClick,
  closeOnChildOverlayClick
}) {
  const i18n = hooks.useI18n();
  const {
    mdDown
  } = breakpoints.useBreakpoints();
  const {
    polarisSummerEditions2023: se23
  } = hooks$1.useFeatures();
  const [popoverActive, setPopoverActive] = React.useState(false);
  const [localPinnedFilters, setLocalPinnedFilters] = React.useState([]);
  const hasMounted = React.useRef(false);
  React.useEffect(() => {
    hasMounted.current = true;
  });
  const togglePopoverActive = () => setPopoverActive(popoverActive => !popoverActive);
  const handleAddFilterClick = () => {
    onAddFilterClick?.();
    togglePopoverActive();
  };
  const appliedFilterKeys = appliedFilters?.map(({
    key
  }) => key);
  const pinnedFiltersFromPropsAndAppliedFilters = filters.filter(({
    pinned,
    key
  }) => (Boolean(pinned) || appliedFilterKeys?.includes(key)) &&
  // Filters that are pinned in local state display at the end of our list
  !localPinnedFilters.find(filterKey => filterKey === key));
  const pinnedFiltersFromLocalState = localPinnedFilters.map(key => filters.find(filter => filter.key === key)).reduce((acc, filter) => filter ? [...acc, filter] : acc, []);
  const pinnedFilters = [...pinnedFiltersFromPropsAndAppliedFilters, ...pinnedFiltersFromLocalState];
  const onFilterClick = ({
    key,
    onAction
  }) => () => {
    // PopoverOverlay will cause a rerender of the component and nuke the
    // popoverActive state, so we set this as a microtask
    setTimeout(() => {
      setLocalPinnedFilters(currentLocalPinnedFilters => [...new Set([...currentLocalPinnedFilters, key])]);
      onAction?.();
      togglePopoverActive();
    }, 0);
  };
  const filterToActionItem = filter => ({
    ...filter,
    content: filter.label,
    onAction: onFilterClick(filter)
  });
  const unpinnedFilters = filters.filter(filter => !pinnedFilters.some(({
    key
  }) => key === filter.key));
  const unsectionedFilters = unpinnedFilters.filter(filter => !filter.section).map(filterToActionItem);
  const sectionedFilters = unpinnedFilters.filter(filter => filter.section).reduce((acc, filter) => {
    const filterActionItem = filterToActionItem(filter);
    const sectionIndex = acc.findIndex(section => section.title === filter.section);
    if (sectionIndex === -1) {
      acc.push({
        title: filter.section,
        items: [filterActionItem]
      });
    } else {
      acc[sectionIndex].items.push(filterActionItem);
    }
    return acc;
  }, []);
  const hasOneOrMorePinnedFilters = pinnedFilters.length >= 1;
  const se23LabelVariant = mdDown && se23 ? 'bodyLg' : 'bodySm';
  const labelVariant = mdDown ? 'bodyMd' : 'bodySm';
  const addFilterActivator = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(UnstyledButton.UnstyledButton, {
    type: "button",
    className: Filters$1.default.AddFilter,
    onClick: handleAddFilterClick,
    "aria-label": i18n.translate('Polaris.Filters.addFilter'),
    disabled: disabled || unsectionedFilters.length === 0 && sectionedFilters.length === 0 || disableFilters
  }, /*#__PURE__*/React.createElement(Text.Text, {
    variant: se23 ? se23LabelVariant : labelVariant,
    as: "span"
  }, i18n.translate('Polaris.Filters.addFilter'), ' '), /*#__PURE__*/React.createElement(polarisIcons.PlusMinor, null)));
  const handleClearAllFilters = () => {
    setLocalPinnedFilters([]);
    onClearAll?.();
  };
  const shouldShowAddButton = filters.some(filter => !filter.pinned);
  const additionalContent = React.useMemo(() => {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: Filters$1.default.Spinner
    }, loading ? /*#__PURE__*/React.createElement(Spinner.Spinner, {
      size: "small"
    }) : null), children);
  }, [loading, children]);
  const containerSpacing = se23 ? {
    paddingInlineStart: '2',
    paddingInlineEnd: '2',
    paddingBlockStart: '1_5-experimental',
    paddingBlockEnd: '1_5-experimental'
  } : {
    paddingBlockStart: {
      xs: '3',
      md: '2'
    },
    paddingBlockEnd: {
      xs: '3',
      md: '2'
    },
    paddingInlineStart: '2',
    paddingInlineEnd: {
      xs: '4',
      md: '3'
    }
  };
  const queryFieldMarkup = hideQueryField ? null : /*#__PURE__*/React.createElement("div", {
    className: Filters$1.default.Container
  }, /*#__PURE__*/React.createElement(Box.Box, containerSpacing, /*#__PURE__*/React.createElement(HorizontalStack.HorizontalStack, {
    align: "start",
    blockAlign: "center",
    gap: {
      xs: '4',
      md: '3'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: Filters$1.default.SearchField,
    style: mountedState ? {
      ...defaultStyle,
      ...transitionStyles[mountedState]
    } : undefined
  }, /*#__PURE__*/React.createElement(SearchField.SearchField, {
    onChange: onQueryChange,
    onFocus: onQueryFocus,
    onBlur: onQueryBlur,
    onClear: onQueryClear,
    value: queryValue,
    placeholder: queryPlaceholder,
    focused: focused,
    disabled: disabled || disableQueryField,
    borderlessQueryField: borderlessQueryField
  })), additionalContent)));
  const mountedStateStyles = mountedState && !hideQueryField ? {
    ...defaultFilterStyles,
    ...transitionFilterStyles[mountedState]
  } : undefined;
  const pinnedFiltersMarkup = pinnedFilters.map(({
    key: filterKey,
    ...pinnedFilter
  }) => {
    const appliedFilter = appliedFilters?.find(({
      key
    }) => key === filterKey);
    const handleFilterPillRemove = () => {
      setLocalPinnedFilters(currentLocalPinnedFilters => currentLocalPinnedFilters.filter(key => key !== filterKey));
      appliedFilter?.onRemove(filterKey);
    };
    return /*#__PURE__*/React.createElement(FilterPill.FilterPill, Object.assign({
      key: filterKey
    }, pinnedFilter, {
      initialActive: hasMounted.current && !pinnedFilter.pinned && !appliedFilter,
      label: appliedFilter?.label || pinnedFilter.label,
      filterKey: filterKey,
      selected: appliedFilterKeys?.includes(filterKey),
      onRemove: handleFilterPillRemove,
      disabled: pinnedFilter.disabled || disableFilters,
      closeOnChildOverlayClick: closeOnChildOverlayClick
    }));
  });
  const addButton = shouldShowAddButton ? /*#__PURE__*/React.createElement("div", {
    className: css.classNames(Filters$1.default.AddFilterActivator, hasOneOrMorePinnedFilters && Filters$1.default.AddFilterActivatorMultiple)
  }, /*#__PURE__*/React.createElement(Popover.Popover, {
    active: popoverActive && !disabled,
    activator: addFilterActivator,
    onClose: togglePopoverActive
  }, /*#__PURE__*/React.createElement(ActionList.ActionList, {
    actionRole: "menuitem",
    items: unsectionedFilters,
    sections: sectionedFilters
  }))) : null;
  const clearAllMarkup = appliedFilters?.length || localPinnedFilters.length ? /*#__PURE__*/React.createElement("div", {
    className: css.classNames(Filters$1.default.ClearAll, hasOneOrMorePinnedFilters && shouldShowAddButton && Filters$1.default.MultiplePinnedFilterClearAll)
  }, /*#__PURE__*/React.createElement(Button.Button, {
    size: "micro",
    plain: true,
    onClick: handleClearAllFilters,
    removeUnderline: true,
    monochrome: se23
  }, i18n.translate('Polaris.Filters.clearFilters'))) : null;
  const filtersMarkup = hideFilters || filters.length === 0 ? null : /*#__PURE__*/React.createElement("div", {
    className: css.classNames(Filters$1.default.FiltersWrapper, shouldShowAddButton && hasOneOrMorePinnedFilters && Filters$1.default.FiltersWrapperWithAddButton),
    "aria-live": "polite",
    style: mountedStateStyles
  }, /*#__PURE__*/React.createElement("div", {
    className: css.classNames(Filters$1.default.FiltersInner)
  }, /*#__PURE__*/React.createElement("div", {
    className: css.classNames(Filters$1.default.FiltersStickyArea)
  }, pinnedFiltersMarkup, addButton, clearAllMarkup)), hideQueryField ? /*#__PURE__*/React.createElement(Box.Box, {
    paddingInlineEnd: "3",
    paddingBlockStart: "2",
    paddingBlockEnd: "2"
  }, /*#__PURE__*/React.createElement(HorizontalStack.HorizontalStack, {
    align: "start",
    blockAlign: "center",
    gap: {
      xs: '4',
      md: '3'
    }
  }, additionalContent)) : null);
  return /*#__PURE__*/React.createElement("div", {
    className: css.classNames(Filters$1.default.Filters, hideQueryField && Filters$1.default.hideQueryField)
  }, queryFieldMarkup, filtersMarkup);
}

exports.Filters = Filters;
