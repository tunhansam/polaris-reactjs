import React, { useRef, useCallback, useMemo } from 'react';
import { Transition } from 'react-transition-group';
import { classNames } from '../../utilities/css.js';
import { useEventListener } from '../../utilities/use-event-listener.js';
import { useToggle } from '../../utilities/use-toggle.js';
import { useOnValueChange } from '../../utilities/use-on-value-change.js';
import { useBreakpoints } from '../../utilities/breakpoints.js';
import { IndexFiltersMode } from './types.js';
import styles from './IndexFilters.scss.js';
import { useIsSticky } from './hooks/useIsSticky/useIsSticky.js';
import { UpdateButtons } from './components/UpdateButtons/UpdateButtons.js';
import { SortButton } from './components/SortButton/SortButton.js';
import { Container } from './components/Container/Container.js';
import { Tabs } from '../Tabs/Tabs.js';
import { SearchFilterButton } from './components/SearchFilterButton/SearchFilterButton.js';
import { Filters } from '../Filters/Filters.js';
import { useI18n } from '../../utilities/i18n/hooks.js';
import { useFeatures } from '../../utilities/features/hooks.js';
import { HorizontalStack } from '../HorizontalStack/HorizontalStack.js';
import { Spinner } from '../Spinner/Spinner.js';

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
  const i18n = useI18n();
  const {
    mdDown
  } = useBreakpoints();
  const defaultRef = useRef(null);
  const filteringRef = useRef(null);
  const {
    value: filtersFocused,
    setFalse: setFiltersUnFocused,
    setTrue: setFiltersFocused
  } = useToggle(false);
  const {
    polarisSummerEditions2023
  } = useFeatures();
  useOnValueChange(mode, newMode => {
    if (newMode === IndexFiltersMode.Filtering) {
      setFiltersFocused();
    } else {
      setFiltersUnFocused();
    }
  });
  useEventListener('keydown', event => {
    if (disableKeyboardShortcuts) return;
    const {
      key
    } = event;
    const tag = document?.activeElement?.tagName;
    if (mode !== IndexFiltersMode.Default && event.key === 'Escape') {
      onPressEscape();
    }
    if (key === 'f' && mode === IndexFiltersMode.Default) {
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
  } = useIsSticky(mode, Boolean(disableStickyMode), isFlushWhenSticky);
  const viewNames = tabs.map(({
    content
  }) => content);
  const handleChangeSortButton = useCallback(value => {
    onSort?.(value);
  }, [onSort]);
  const handleChangeSearch = useCallback(value => {
    onQueryChange(value);
  }, [onQueryChange]);
  const useExecutedCallback = (action, afterEffect) => useCallback(async name => {
    const hasExecuted = await action?.(name);
    if (hasExecuted) {
      setMode(IndexFiltersMode.Default);
      afterEffect?.();
    }
  }, [action, afterEffect]);
  const onExecutedPrimaryAction = useExecutedCallback(primaryAction?.onAction);
  const onExecutedCancelAction = useCallback(() => {
    cancelAction.onAction?.();
    setMode(IndexFiltersMode.Default);
  }, [cancelAction, setMode]);
  const enhancedPrimaryAction = useMemo(() => {
    return primaryAction ? {
      ...primaryAction,
      onAction: onExecutedPrimaryAction
    } : undefined;
  }, [onExecutedPrimaryAction, primaryAction]);
  const enhancedCancelAction = useMemo(() => {
    return {
      ...cancelAction,
      onAction: onExecutedCancelAction
    };
  }, [cancelAction, onExecutedCancelAction]);
  const beginEdit = useCallback(() => {
    setMode(IndexFiltersMode.Filtering);
    onEditStart?.();
  }, [onEditStart, setMode]);
  const updateButtonsMarkup = useMemo(() => /*#__PURE__*/React.createElement(UpdateButtons, {
    primaryAction: enhancedPrimaryAction,
    cancelAction: enhancedCancelAction,
    viewNames: viewNames,
    disabled: disabled
  }), [enhancedPrimaryAction, enhancedCancelAction, disabled, viewNames]);
  const sortMarkup = useMemo(() => {
    if (!sortOptions?.length) {
      return null;
    }
    return /*#__PURE__*/React.createElement(SortButton, {
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
    setMode(IndexFiltersMode.Default);
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
    if (mode !== IndexFiltersMode.Default) {
      return;
    }
    beginEdit();
  }
  return /*#__PURE__*/React.createElement("div", {
    className: styles.IndexFiltersWrapper,
    style: {
      height: indexFilteringHeight
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: intersectionRef
  }), /*#__PURE__*/React.createElement("div", {
    className: classNames(styles.IndexFilters, isSticky && styles.IndexFiltersSticky, isSticky && isFlushWhenSticky && styles.IndexFiltersStickyFlush),
    ref: measurerRef
  }, /*#__PURE__*/React.createElement(Transition, {
    nodeRef: defaultRef,
    in: mode !== IndexFiltersMode.Filtering,
    timeout: TRANSITION_DURATION
  }, state => /*#__PURE__*/React.createElement("div", {
    ref: defaultRef
  }, mode !== IndexFiltersMode.Filtering ? /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement(HorizontalStack, {
    align: "start",
    blockAlign: "center",
    gap: {
      xs: '0',
      md: '2'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: classNames(styles.TabsWrapper, mdDown && styles.SmallScreenTabsWrapper, isLoading && styles.TabsWrapperLoading)
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.TabsInner,
    style: {
      ...defaultStyle,
      ...transitionStyles[state]
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    tabs: tabs,
    selected: selected,
    onSelect: onSelect,
    disabled: Boolean(mode !== IndexFiltersMode.Default || disabled),
    canCreateNewView: canCreateNewView,
    onCreateNewView: onCreateNewView
  })), isLoading && mdDown && /*#__PURE__*/React.createElement("div", {
    className: styles.TabsLoading
  }, /*#__PURE__*/React.createElement(Spinner, {
    size: "small"
  }))), /*#__PURE__*/React.createElement("div", {
    className: styles.ActionWrap
  }, isLoading && !mdDown && /*#__PURE__*/React.createElement(Spinner, {
    size: "small"
  }), mode === IndexFiltersMode.Default ? /*#__PURE__*/React.createElement(React.Fragment, null, hideFilters && hideQueryField ? null : /*#__PURE__*/React.createElement(SearchFilterButton, {
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
  }), sortMarkup) : null, mode === IndexFiltersMode.EditingColumns ? updateButtonsMarkup : null))) : null)), /*#__PURE__*/React.createElement(Transition, {
    nodeRef: filteringRef,
    in: mode === IndexFiltersMode.Filtering,
    timeout: TRANSITION_DURATION
  }, state => /*#__PURE__*/React.createElement("div", {
    ref: filteringRef
  }, mode === IndexFiltersMode.Filtering ? /*#__PURE__*/React.createElement(Filters, {
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
  }, /*#__PURE__*/React.createElement(HorizontalStack, {
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

export { IndexFilters };
