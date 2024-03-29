'use strict';

var React = require('react');
var polarisIcons = require('@shopify/polaris-icons');
var polarisTokens = require('@shopify/polaris-tokens');
var debounce = require('../../utilities/debounce.js');
var css = require('../../utilities/css.js');
var components = require('../../utilities/components.js');
var useLazyRef = require('../../utilities/use-lazy-ref.js');
var useEventListener = require('../../utilities/use-event-listener.js');
var ResourceList$1 = require('./ResourceList.scss.js');
var Select = require('../Select/Select.js');
var ResourceItem = require('../ResourceItem/ResourceItem.js');
var types = require('../../utilities/resource-list/types.js');
var hooks = require('../../utilities/i18n/hooks.js');
var useIsBulkActionsSticky = require('../BulkActions/hooks/use-is-bulk-actions-sticky.js');
var SelectAllActions = require('../SelectAllActions/SelectAllActions.js');
var Button = require('../Button/Button.js');
var CheckableButton = require('../CheckableButton/CheckableButton.js');
var Sticky = require('../Sticky/Sticky.js');
var EmptySearchResult = require('../EmptySearchResult/EmptySearchResult.js');
var Spinner = require('../Spinner/Spinner.js');
var context = require('../../utilities/resource-list/context.js');
var BulkActions = require('../BulkActions/BulkActions.js');

const SMALL_SPINNER_HEIGHT = 28;
const LARGE_SPINNER_HEIGHT = 45;
function getAllItemsOnPage(items, idForItem) {
  return items.map((item, index) => {
    return idForItem(item, index);
  });
}
const isBreakpointsXS = () => {
  return typeof window === 'undefined' ? false : window.innerWidth < parseFloat(polarisTokens.toPx(polarisTokens.tokens.breakpoints['breakpoints-sm']) ?? '');
};
function defaultIdForItem(item, index) {
  return Object.prototype.hasOwnProperty.call(item, 'id') ? item.id : index.toString();
}
function ResourceList({
  items,
  filterControl,
  flushFilters,
  emptyState,
  emptySearchState,
  resourceName: resourceNameProp,
  promotedBulkActions,
  bulkActions,
  selectedItems = [],
  isFiltered,
  selectable,
  hasMoreItems,
  loading,
  headerContent,
  showHeader,
  totalItemsCount,
  sortValue,
  sortOptions,
  alternateTool,
  onSortChange,
  onSelectionChange,
  renderItem,
  idForItem = defaultIdForItem,
  resolveItemId
}) {
  const i18n = hooks.useI18n();
  const [selectMode, setSelectMode] = React.useState(Boolean(selectedItems && selectedItems.length > 0));
  const [loadingPosition, setLoadingPositionState] = React.useState(0);
  const [lastSelected, setLastSelected] = React.useState();
  const [smallScreen, setSmallScreen] = React.useState(isBreakpointsXS());
  const forceUpdate = React.useReducer((x = 0) => x + 1, 0)[1];
  const checkableButtonRef = React.useRef(null);
  const {
    bulkActionsIntersectionRef,
    tableMeasurerRef,
    isBulkActionsSticky,
    bulkActionsAbsoluteOffset,
    bulkActionsMaxWidth,
    bulkActionsOffsetLeft,
    computeTableDimensions
  } = useIsBulkActionsSticky.useIsBulkActionsSticky(selectMode);
  React.useEffect(() => {
    computeTableDimensions();
  }, [computeTableDimensions, items.length]);
  const defaultResourceName = useLazyRef.useLazyRef(() => ({
    singular: i18n.translate('Polaris.ResourceList.defaultItemSingular'),
    plural: i18n.translate('Polaris.ResourceList.defaultItemPlural')
  }));
  const listRef = React.useRef(null);
  const handleSelectMode = selectMode => {
    setSelectMode(selectMode);
    if (!selectMode && onSelectionChange) {
      onSelectionChange([]);
    }
  };
  const handleResize = debounce.debounce(() => {
    const newSmallScreen = isBreakpointsXS();
    if (selectedItems && selectedItems.length === 0 && selectMode && !newSmallScreen) {
      handleSelectMode(false);
    }
    if (smallScreen !== newSmallScreen) {
      setSmallScreen(newSmallScreen);
    }
  }, 50, {
    leading: true,
    trailing: true,
    maxWait: 50
  });
  useEventListener.useEventListener('resize', handleResize);
  const isSelectable = Boolean(promotedBulkActions && promotedBulkActions.length > 0 || bulkActions && bulkActions.length > 0 || selectable) && !smallScreen;
  const selectAllSelectState = () => {
    let selectState = 'indeterminate';
    if (!selectedItems || Array.isArray(selectedItems) && selectedItems.length === 0) {
      selectState = false;
    } else if (selectedItems === types.SELECT_ALL_ITEMS || Array.isArray(selectedItems) && selectedItems.length === items.length) {
      selectState = true;
    }
    return selectState;
  };
  const resourceName = resourceNameProp ? resourceNameProp : defaultResourceName.current;
  const headerTitle = () => {
    const itemsCount = items.length;
    const resource = !loading && (!totalItemsCount && itemsCount === 1 || totalItemsCount === 1) ? resourceName.singular : resourceName.plural;
    if (loading) {
      return i18n.translate('Polaris.ResourceList.loading', {
        resource
      });
    } else if (totalItemsCount) {
      return i18n.translate('Polaris.ResourceList.showingTotalCount', {
        itemsCount,
        totalItemsCount,
        resource
      });
    } else if (headerContent) {
      return headerContent;
    } else {
      return i18n.translate('Polaris.ResourceList.showing', {
        itemsCount,
        resource
      });
    }
  };
  const selectAllActionsLabel = () => {
    const selectedItemsCount = selectedItems === types.SELECT_ALL_ITEMS ? `${items.length}+` : selectedItems.length;
    return i18n.translate('Polaris.ResourceList.selected', {
      selectedItemsCount
    });
  };
  const selectAllActionsAccessibilityLabel = () => {
    const selectedItemsCount = selectedItems.length;
    const totalItemsCount = items.length;
    const allSelected = selectedItemsCount === totalItemsCount;
    if (totalItemsCount === 1 && allSelected) {
      return i18n.translate('Polaris.ResourceList.a11yCheckboxDeselectAllSingle', {
        resourceNameSingular: resourceName.singular
      });
    } else if (totalItemsCount === 1) {
      return i18n.translate('Polaris.ResourceList.a11yCheckboxSelectAllSingle', {
        resourceNameSingular: resourceName.singular
      });
    } else if (allSelected) {
      return i18n.translate('Polaris.ResourceList.a11yCheckboxDeselectAllMultiple', {
        itemsLength: items.length,
        resourceNamePlural: resourceName.plural
      });
    } else {
      return i18n.translate('Polaris.ResourceList.a11yCheckboxSelectAllMultiple', {
        itemsLength: items.length,
        resourceNamePlural: resourceName.plural
      });
    }
  };
  const paginatedSelectAllText = () => {
    if (!isSelectable || !hasMoreItems) {
      return;
    }
    if (selectedItems === types.SELECT_ALL_ITEMS) {
      return i18n.translate(isFiltered ? 'Polaris.ResourceList.allFilteredItemsSelected' : 'Polaris.ResourceList.allItemsSelected', {
        itemsLength: items.length,
        resourceNamePlural: resourceName.plural
      });
    }
  };
  const paginatedSelectAllAction = () => {
    if (!isSelectable || !hasMoreItems) {
      return;
    }
    const actionText = selectedItems === types.SELECT_ALL_ITEMS ? i18n.translate('Polaris.Common.undo') : i18n.translate(isFiltered ? 'Polaris.ResourceList.selectAllFilteredItems' : 'Polaris.ResourceList.selectAllItems', {
      itemsLength: items.length,
      resourceNamePlural: resourceName.plural
    });
    return {
      content: actionText,
      onAction: handleSelectAllItemsInStore
    };
  };
  const emptySearchResultText = {
    title: i18n.translate('Polaris.ResourceList.emptySearchResultTitle', {
      resourceNamePlural: resourceName.plural
    }),
    description: i18n.translate('Polaris.ResourceList.emptySearchResultDescription')
  };
  const handleSelectAllItemsInStore = () => {
    const newlySelectedItems = selectedItems === types.SELECT_ALL_ITEMS ? getAllItemsOnPage(items, idForItem) : types.SELECT_ALL_ITEMS;
    if (onSelectionChange) {
      onSelectionChange(newlySelectedItems);
    }
  };
  const setLoadingPosition = React.useCallback(() => {
    if (listRef.current != null) {
      if (typeof window === 'undefined') {
        return;
      }
      const overlay = listRef.current.getBoundingClientRect();
      const viewportHeight = Math.max(document.documentElement ? document.documentElement.clientHeight : 0, window.innerHeight || 0);
      const overflow = viewportHeight - overlay.height;
      const spinnerHeight = items.length === 1 ? SMALL_SPINNER_HEIGHT : LARGE_SPINNER_HEIGHT;
      const spinnerPosition = overflow > 0 ? (overlay.height - spinnerHeight) / 2 : (viewportHeight - overlay.top - spinnerHeight) / 2;
      setLoadingPositionState(spinnerPosition);
    }
  }, [listRef, items.length]);
  const itemsExist = items.length > 0;
  React.useEffect(() => {
    if (loading) {
      setLoadingPosition();
    }
  }, [loading, setLoadingPosition]);
  React.useEffect(() => {
    if (selectedItems && selectedItems.length > 0 && !selectMode) {
      setSelectMode(true);
    }
    if ((!selectedItems || selectedItems.length === 0) && !isBreakpointsXS()) {
      setSelectMode(false);
    }
  }, [selectedItems, selectMode]);
  React.useEffect(() => {
    forceUpdate();
  }, [forceUpdate, items]);
  const renderItemWithId = (item, index) => {
    const id = idForItem(item, index);
    const itemContent = renderItem(item, id, index);
    if (process.env.NODE_ENV === 'development' && !components.isElementOfType(itemContent, ResourceItem.ResourceItem)) {
      // eslint-disable-next-line no-console
      console.warn('<ResourceList /> renderItem function should return a <ResourceItem />.');
    }
    return itemContent;
  };
  const handleMultiSelectionChange = (lastSelected, currentSelected, resolveItemId) => {
    const min = Math.min(lastSelected, currentSelected);
    const max = Math.max(lastSelected, currentSelected);
    return items.slice(min, max + 1).map(resolveItemId);
  };
  const handleSelectionChange = (selected, id, sortOrder, shiftKey) => {
    if (selectedItems == null || onSelectionChange == null) {
      return;
    }
    let newlySelectedItems = selectedItems === types.SELECT_ALL_ITEMS ? getAllItemsOnPage(items, idForItem) : [...selectedItems];
    if (sortOrder !== undefined) {
      setLastSelected(sortOrder);
    }
    const lastSelectedFromState = lastSelected;
    let selectedIds = [id];
    if (shiftKey && lastSelectedFromState != null && sortOrder !== undefined && resolveItemId) {
      selectedIds = handleMultiSelectionChange(lastSelectedFromState, sortOrder, resolveItemId);
    }
    newlySelectedItems = [...new Set([...newlySelectedItems, ...selectedIds])];
    if (!selected) {
      for (const selectedId of selectedIds) {
        newlySelectedItems.splice(newlySelectedItems.indexOf(selectedId), 1);
      }
    }
    if (newlySelectedItems.length === 0 && !isBreakpointsXS()) {
      handleSelectMode(false);
    } else if (newlySelectedItems.length > 0) {
      handleSelectMode(true);
    }
    if (onSelectionChange) {
      onSelectionChange(newlySelectedItems);
    }
  };
  const handleToggleAll = () => {
    let newlySelectedItems;
    if (Array.isArray(selectedItems) && selectedItems.length === items.length || selectedItems === types.SELECT_ALL_ITEMS) {
      newlySelectedItems = [];
    } else {
      newlySelectedItems = items.map((item, index) => {
        return idForItem(item, index);
      });
    }
    if (newlySelectedItems.length === 0 && !isBreakpointsXS()) {
      handleSelectMode(false);
    } else if (newlySelectedItems.length > 0) {
      handleSelectMode(true);
    }
    if (onSelectionChange) {
      onSelectionChange(newlySelectedItems);
    }

    // setTimeout ensures execution after the Transition on BulkActions
    setTimeout(() => {
      checkableButtonRef?.current?.focus();
    }, 0);
  };
  const selectAllActionsMarkup = isSelectable ? /*#__PURE__*/React.createElement("div", {
    className: ResourceList$1.default.SelectAllActionsWrapper
  }, /*#__PURE__*/React.createElement(SelectAllActions.SelectAllActions, {
    label: selectAllActionsLabel(),
    accessibilityLabel: selectAllActionsAccessibilityLabel(),
    selected: selectAllSelectState(),
    onToggleAll: handleToggleAll,
    selectMode: selectMode,
    paginatedSelectAllAction: paginatedSelectAllAction(),
    paginatedSelectAllText: paginatedSelectAllText(),
    disabled: loading,
    ref: checkableButtonRef
  })) : null;
  const bulkActionClassNames = css.classNames(ResourceList$1.default.BulkActionsWrapper, isBulkActionsSticky && ResourceList$1.default.BulkActionsWrapperSticky);
  const bulkActionsMarkup = isSelectable && selectMode && (bulkActions || promotedBulkActions) ? /*#__PURE__*/React.createElement("div", {
    className: bulkActionClassNames,
    style: {
      top: isBulkActionsSticky ? undefined : bulkActionsAbsoluteOffset,
      width: bulkActionsMaxWidth,
      left: isBulkActionsSticky ? bulkActionsOffsetLeft : undefined
    }
  }, /*#__PURE__*/React.createElement(BulkActions.BulkActions, {
    selectMode: selectMode,
    onSelectModeToggle: handleSelectMode,
    promotedActions: promotedBulkActions,
    actions: bulkActions,
    disabled: loading,
    isSticky: isBulkActionsSticky,
    width: bulkActionsMaxWidth
  })) : null;
  const filterControlMarkup = filterControl ? /*#__PURE__*/React.createElement("div", {
    className: css.classNames(!flushFilters && ResourceList$1.default.FiltersWrapper)
  }, filterControl) : null;
  const sortingSelectMarkup = sortOptions && sortOptions.length > 0 && !alternateTool ? /*#__PURE__*/React.createElement("div", {
    className: ResourceList$1.default.SortWrapper
  }, /*#__PURE__*/React.createElement(Select.Select, {
    label: i18n.translate('Polaris.ResourceList.sortingLabel'),
    labelInline: !smallScreen,
    labelHidden: smallScreen,
    options: sortOptions,
    onChange: onSortChange,
    value: sortValue,
    disabled: selectMode
  })) : null;
  const alternateToolMarkup = alternateTool && !sortingSelectMarkup ? /*#__PURE__*/React.createElement("div", {
    className: ResourceList$1.default.AlternateToolWrapper
  }, alternateTool) : null;
  const headerTitleMarkup = /*#__PURE__*/React.createElement("div", {
    className: ResourceList$1.default.HeaderTitleWrapper
  }, headerTitle());
  const selectButtonMarkup = isSelectable ? /*#__PURE__*/React.createElement("div", {
    className: ResourceList$1.default.SelectButtonWrapper
  }, /*#__PURE__*/React.createElement(Button.Button, {
    disabled: selectMode,
    icon: polarisIcons.EnableSelectionMinor,
    onClick: () => handleSelectMode(true)
  }, i18n.translate('Polaris.ResourceList.selectButtonText'))) : null;
  const checkableButtonMarkup = isSelectable ? /*#__PURE__*/React.createElement("div", {
    className: ResourceList$1.default.CheckableButtonWrapper
  }, /*#__PURE__*/React.createElement(CheckableButton.CheckableButton, {
    accessibilityLabel: selectAllActionsAccessibilityLabel(),
    label: headerTitle(),
    onToggleAll: handleToggleAll,
    disabled: loading,
    ref: checkableButtonRef
  })) : null;
  const needsHeader = isSelectable || sortOptions && sortOptions.length > 0 || alternateTool;
  const headerWrapperOverlay = loading ? /*#__PURE__*/React.createElement("div", {
    className: ResourceList$1.default['HeaderWrapper-overlay']
  }) : null;
  const showEmptyState = emptyState && !itemsExist && !loading;
  const showEmptySearchState = !showEmptyState && filterControl && !itemsExist && !loading;
  const headerMarkup = !showEmptyState && showHeader !== false && !showEmptySearchState && (showHeader || needsHeader) && listRef.current && /*#__PURE__*/React.createElement("div", {
    className: ResourceList$1.default.HeaderOuterWrapper
  }, /*#__PURE__*/React.createElement(Sticky.Sticky, {
    boundingElement: listRef.current
  }, isSticky => {
    const headerClassName = css.classNames(ResourceList$1.default.HeaderWrapper, sortOptions && sortOptions.length > 0 && !alternateTool && ResourceList$1.default['HeaderWrapper-hasSort'], alternateTool && ResourceList$1.default['HeaderWrapper-hasAlternateTool'], isSelectable && ResourceList$1.default['HeaderWrapper-hasSelect'], loading && ResourceList$1.default['HeaderWrapper-disabled'], isSelectable && selectMode && ResourceList$1.default['HeaderWrapper-inSelectMode'], isSticky && ResourceList$1.default['HeaderWrapper-isSticky']);
    return /*#__PURE__*/React.createElement("div", {
      className: headerClassName
    }, headerWrapperOverlay, /*#__PURE__*/React.createElement("div", {
      className: ResourceList$1.default.HeaderContentWrapper
    }, headerTitleMarkup, checkableButtonMarkup, alternateToolMarkup, sortingSelectMarkup, selectButtonMarkup), selectAllActionsMarkup);
  }));
  const emptySearchStateMarkup = showEmptySearchState ? emptySearchState || /*#__PURE__*/React.createElement("div", {
    className: ResourceList$1.default.EmptySearchResultWrapper
  }, /*#__PURE__*/React.createElement(EmptySearchResult.EmptySearchResult, Object.assign({}, emptySearchResultText, {
    withIllustration: true
  }))) : null;
  const emptyStateMarkup = showEmptyState ? emptyState : null;
  const defaultTopPadding = 8;
  const topPadding = loadingPosition > 0 ? loadingPosition : defaultTopPadding;
  const spinnerStyle = {
    paddingTop: `${topPadding}px`
  };
  const spinnerSize = items.length < 2 ? 'small' : 'large';
  const loadingOverlay = loading ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("li", {
    className: ResourceList$1.default.SpinnerContainer,
    style: spinnerStyle
  }, /*#__PURE__*/React.createElement(Spinner.Spinner, {
    size: spinnerSize,
    accessibilityLabel: "Items are loading"
  })), /*#__PURE__*/React.createElement("li", {
    className: ResourceList$1.default.LoadingOverlay
  })) : null;
  const className = css.classNames(ResourceList$1.default.ItemWrapper, loading && ResourceList$1.default['ItemWrapper-isLoading']);
  const loadingWithoutItemsMarkup = loading && !itemsExist ? /*#__PURE__*/React.createElement("div", {
    className: className,
    tabIndex: -1
  }, loadingOverlay) : null;
  const resourceListClassName = css.classNames(ResourceList$1.default.ResourceList, loading && ResourceList$1.default.disabledPointerEvents, selectMode && ResourceList$1.default.disableTextSelection);
  const listMarkup = itemsExist ? /*#__PURE__*/React.createElement("ul", {
    className: resourceListClassName,
    ref: listRef,
    "aria-live": "polite",
    "aria-busy": loading
  }, loadingOverlay, React.Children.toArray(items.map(renderItemWithId))) : null;

  // This is probably a legit error but I don't have the time to refactor this
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const context$1 = {
    selectable: isSelectable,
    selectedItems,
    selectMode,
    hasBulkActions: Boolean(bulkActions),
    resourceName,
    loading,
    onSelectionChange: handleSelectionChange
  };
  const resourceListWrapperClasses = css.classNames(ResourceList$1.default.ResourceListWrapper, Boolean(bulkActionsMarkup) && selectMode && bulkActions && ResourceList$1.default.ResourceListWrapperWithBulkActions);
  return /*#__PURE__*/React.createElement(context.ResourceListContext.Provider, {
    value: context$1
  }, /*#__PURE__*/React.createElement("div", {
    className: resourceListWrapperClasses,
    ref: tableMeasurerRef
  }, filterControlMarkup, headerMarkup, bulkActionsMarkup, listMarkup, emptySearchStateMarkup, emptyStateMarkup, loadingWithoutItemsMarkup), /*#__PURE__*/React.createElement("div", {
    ref: bulkActionsIntersectionRef
  }));
}
ResourceList.Item = ResourceItem.ResourceItem;

exports.ResourceList = ResourceList;
