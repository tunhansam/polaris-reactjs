'use strict';

var React = require('react');
var reactTransitionGroup = require('react-transition-group');
var css = require('../../utilities/css.js');
var useEventListener = require('../../utilities/use-event-listener.js');
var useToggle = require('../../utilities/use-toggle.js');
var useOnValueChange = require('../../utilities/use-on-value-change.js');
var breakpoints = require('../../utilities/breakpoints.js');
var types = require('./types.js');
var IndexFilters$1 = require('./IndexFilters.scss.js');
var useIsSticky = require('./hooks/useIsSticky/useIsSticky.js');
var UpdateButtons = require('./components/UpdateButtons/UpdateButtons.js');
var SortButton = require('./components/SortButton/SortButton.js');
var Container = require('./components/Container/Container.js');
var Tabs = require('../Tabs/Tabs.js');
var SearchFilterButton = require('./components/SearchFilterButton/SearchFilterButton.js');
var Filters = require('../Filters/Filters.js');
var hooks = require('../../utilities/i18n/hooks.js');
var hooks$1 = require('../../utilities/features/hooks.js');
var HorizontalStack = require('../HorizontalStack/HorizontalStack.js');
var Spinner = require('../Spinner/Spinner.js');

const DEFAULT_IGNORED_TAGS = ['INPUT', 'SELECT', 'TEXTAREA'];
const TRANSITION_DURATION = 150;
const defaultStyle = {
  transition: `opacity ${TRANSITION_DURATION}ms var(--p-motion-ease)`,
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
function IndexFilters({
  tabs,
  selected,
  onSelect,
  onSort,
  onSortKeyChange,
  onSortDirectionChange,
  onAddFilterClick,
  sortOptions,
  sortSelected,
  queryValue = '',
  queryPlaceholder,
  primaryAction,
  cancelAction,
  filters,
  appliedFilters,
  onClearAll,
  onQueryChange,
  onQueryFocus,
  onQueryClear,
  onEditStart,
  disabled,
  disableQueryField,
  hideFilters,
  loading,
  mode,
  setMode,
  disableStickyMode,
  isFlushWhenSticky = false,
  canCreateNewView = true,
  onCreateNewView,
  filteringAccessibilityLabel,
  filteringAccessibilityTooltip,
  hideQueryField,
  closeOnChildOverlayClick,
  disableKeyboardShortcuts
}) {
  const i18n = hooks.useI18n();
  const {
    mdDown
  } = breakpoints.useBreakpoints();
  const defaultRef = React.useRef(null);
  const filteringRef = React.useRef(null);
  const {
    value: filtersFocused,
    setFalse: setFiltersUnFocused,
    setTrue: setFiltersFocused
  } = useToggle.useToggle(false);
  const {
    polarisSummerEditions2023
  } = hooks$1.useFeatures();
  useOnValueChange.useOnValueChange(mode, newMode => {
    if (newMode === types.IndexFiltersMode.Filtering) {
      setFiltersFocused();
    } else {
      setFiltersUnFocused();
    }
  });
  useEventListener.useEventListener('keydown', event => {
    if (disableKeyboardShortcuts) return;
    const {
      key
    } = event;
    const tag = document?.activeElement?.tagName;
    if (mode !== types.IndexFiltersMode.Default && event.key === 'Escape') {
      onPressEscape();
    }
    if (key === 'f' && mode === types.IndexFiltersMode.Default) {
      if (tag && DEFAULT_IGNORED_TAGS.includes(tag)) {
        return;
      }
      onPressF();
      event.preventDefault();
    }
  });
  const {
    intersectionRef,
    measurerRef,
    indexFilteringHeight,
    isSticky
  } = useIsSticky.useIsSticky(mode, Boolean(disableStickyMode), isFlushWhenSticky);
  const viewNames = tabs.map(({
    content
  }) => content);
  const handleChangeSortButton = React.useCallback(value => {
    onSort?.(value);
  }, [onSort]);
  const handleChangeSearch = React.useCallback(value => {
    onQueryChange(value);
  }, [onQueryChange]);
  const useExecutedCallback = (action, afterEffect) => React.useCallback(async name => {
    const hasExecuted = await action?.(name);
    if (hasExecuted) {
      setMode(types.IndexFiltersMode.Default);
      afterEffect?.();
    }
  }, [action, afterEffect]);
  const onExecutedPrimaryAction = useExecutedCallback(primaryAction?.onAction);
  const onExecutedCancelAction = React.useCallback(() => {
    cancelAction.onAction?.();
    setMode(types.IndexFiltersMode.Default);
  }, [cancelAction, setMode]);
  const enhancedPrimaryAction = React.useMemo(() => {
    return primaryAction ? {
      ...primaryAction,
      onAction: onExecutedPrimaryAction
    } : undefined;
  }, [onExecutedPrimaryAction, primaryAction]);
  const enhancedCancelAction = React.useMemo(() => {
    return {
      ...cancelAction,
      onAction: onExecutedCancelAction
    };
  }, [cancelAction, onExecutedCancelAction]);
  const beginEdit = React.useCallback(() => {
    setMode(types.IndexFiltersMode.Filtering);
    onEditStart?.();
  }, [onEditStart, setMode]);
  const updateButtonsMarkup = React.useMemo(() => /*#__PURE__*/React.createElement(UpdateButtons.UpdateButtons, {
    primaryAction: enhancedPrimaryAction,
    cancelAction: enhancedCancelAction,
    viewNames: viewNames,
    disabled: disabled
  }), [enhancedPrimaryAction, enhancedCancelAction, disabled, viewNames]);
  const sortMarkup = React.useMemo(() => {
    if (!sortOptions?.length) {
      return null;
    }
    return /*#__PURE__*/React.createElement(SortButton.SortButton, {
      choices: sortOptions,
      selected: sortSelected,
      onChange: handleChangeSortButton,
      onChangeKey: onSortKeyChange,
      onChangeDirection: onSortDirectionChange,
      disabled: disabled
    });
  }, [handleChangeSortButton, onSortDirectionChange, onSortKeyChange, sortOptions, sortSelected, disabled]);
  const isActionLoading = primaryAction?.loading || cancelAction?.loading;
  function handleClickFilterButton() {
    beginEdit();
  }
  const searchFilterTooltipLabelId = disableKeyboardShortcuts ? 'Polaris.IndexFilters.searchFilterTooltip' : 'Polaris.IndexFilters.searchFilterTooltipWithShortcut';
  const searchFilterTooltip = filteringAccessibilityTooltip || i18n.translate(searchFilterTooltipLabelId);
  const searchFilterAriaLabel = filteringAccessibilityLabel || i18n.translate('Polaris.IndexFilters.searchFilterAccessibilityLabel');
  const isLoading = loading || isActionLoading;
  function onPressEscape() {
    cancelAction?.onAction();
    setMode(types.IndexFiltersMode.Default);
  }
  function handleClearSearch() {
    onQueryClear?.();
  }
  function handleQueryBlur() {
    setFiltersUnFocused();
  }
  function handleQueryFocus() {
    setFiltersFocused();
    onQueryFocus?.();
  }
  function onPressF() {
    if (mode !== types.IndexFiltersMode.Default) {
      return;
    }
    beginEdit();
  }
  return /*#__PURE__*/React.createElement("div", {
    className: IndexFilters$1.default.IndexFiltersWrapper,
    style: {
      height: indexFilteringHeight
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: intersectionRef
  }), /*#__PURE__*/React.createElement("div", {
    className: css.classNames(IndexFilters$1.default.IndexFilters, isSticky && IndexFilters$1.default.IndexFiltersSticky, isSticky && isFlushWhenSticky && IndexFilters$1.default.IndexFiltersStickyFlush),
    ref: measurerRef
  }, /*#__PURE__*/React.createElement(reactTransitionGroup.Transition, {
    nodeRef: defaultRef,
    in: mode !== types.IndexFiltersMode.Filtering,
    timeout: TRANSITION_DURATION
  }, state => /*#__PURE__*/React.createElement("div", {
    ref: defaultRef
  }, mode !== types.IndexFiltersMode.Filtering ? /*#__PURE__*/React.createElement(Container.Container, null, /*#__PURE__*/React.createElement(HorizontalStack.HorizontalStack, {
    align: "start",
    blockAlign: "center",
    gap: {
      xs: '0',
      md: '2'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: css.classNames(IndexFilters$1.default.TabsWrapper, mdDown && IndexFilters$1.default.SmallScreenTabsWrapper, isLoading && IndexFilters$1.default.TabsWrapperLoading)
  }, /*#__PURE__*/React.createElement("div", {
    className: IndexFilters$1.default.TabsInner,
    style: {
      ...defaultStyle,
      ...transitionStyles[state]
    }
  }, /*#__PURE__*/React.createElement(Tabs.Tabs, {
    tabs: tabs,
    selected: selected,
    onSelect: onSelect,
    disabled: Boolean(mode !== types.IndexFiltersMode.Default || disabled),
    canCreateNewView: canCreateNewView,
    onCreateNewView: onCreateNewView
  })), isLoading && mdDown && /*#__PURE__*/React.createElement("div", {
    className: IndexFilters$1.default.TabsLoading
  }, /*#__PURE__*/React.createElement(Spinner.Spinner, {
    size: "small"
  }))), /*#__PURE__*/React.createElement("div", {
    className: IndexFilters$1.default.ActionWrap
  }, isLoading && !mdDown && /*#__PURE__*/React.createElement(Spinner.Spinner, {
    size: "small"
  }), mode === types.IndexFiltersMode.Default ? /*#__PURE__*/React.createElement(React.Fragment, null, hideFilters && hideQueryField ? null : /*#__PURE__*/React.createElement(SearchFilterButton.SearchFilterButton, {
    onClick: handleClickFilterButton,
    label: searchFilterAriaLabel,
    tooltipContent: searchFilterTooltip,
    disabled: disabled,
    hideFilters: hideFilters,
    hideQueryField: hideQueryField,
    style: {
      ...defaultStyle,
      ...transitionStyles[state]
    }
  }), sortMarkup) : null, mode === types.IndexFiltersMode.EditingColumns ? updateButtonsMarkup : null))) : null)), /*#__PURE__*/React.createElement(reactTransitionGroup.Transition, {
    nodeRef: filteringRef,
    in: mode === types.IndexFiltersMode.Filtering,
    timeout: TRANSITION_DURATION
  }, state => /*#__PURE__*/React.createElement("div", {
    ref: filteringRef
  }, mode === types.IndexFiltersMode.Filtering ? /*#__PURE__*/React.createElement(Filters.Filters, {
    queryValue: queryValue,
    queryPlaceholder: queryPlaceholder,
    onQueryChange: handleChangeSearch,
    onQueryClear: handleClearSearch,
    onQueryFocus: handleQueryFocus,
    onQueryBlur: handleQueryBlur,
    onAddFilterClick: onAddFilterClick,
    filters: filters,
    appliedFilters: appliedFilters,
    onClearAll: onClearAll,
    disableFilters: disabled,
    hideFilters: hideFilters,
    hideQueryField: hideQueryField,
    disableQueryField: disabled || disableQueryField,
    loading: loading || isActionLoading,
    focused: filtersFocused,
    mountedState: mdDown ? undefined : state,
    borderlessQueryField: true,
    closeOnChildOverlayClick: closeOnChildOverlayClick
  }, /*#__PURE__*/React.createElement(HorizontalStack.HorizontalStack, {
    gap: polarisSummerEditions2023 ? '2' : '3',
    align: "start",
    blockAlign: "center"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...defaultStyle,
      ...transitionStyles[state]
    }
  }, updateButtonsMarkup), sortMarkup)) : null))));
}

exports.IndexFilters = IndexFilters;
