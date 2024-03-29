import React, { forwardRef, useState, useRef, useEffect, useCallback } from 'react';
import { InfoMinor, DuplicateMinor, EditMinor, Columns3Minor, DeleteMinor, ChevronDownMinor, CaretDownMinor } from '@shopify/polaris-icons';
import { classNames } from '../../../../utilities/css.js';
import { focusFirstFocusableNode, handleMouseUpByBlurring } from '../../../../utilities/focus.js';
import { useBreakpoints } from '../../../../utilities/breakpoints.js';
import styles from '../../Tabs.scss.js';
import { DuplicateModal } from './components/DuplicateModal/DuplicateModal.js';
import { RenameModal } from './components/RenameModal/RenameModal.js';
import { useI18n } from '../../../../utilities/i18n/hooks.js';
import { useFeatures } from '../../../../utilities/features/hooks.js';
import { Icon } from '../../../Icon/Icon.js';
import { Modal } from '../../../Modal/Modal.js';
import { Popover } from '../../../Popover/Popover.js';
import { ActionList } from '../../../ActionList/ActionList.js';
import { HorizontalStack } from '../../../HorizontalStack/HorizontalStack.js';
import { Text } from '../../../Text/Text.js';
import { UnstyledLink } from '../../../UnstyledLink/UnstyledLink.js';
import { UnstyledButton } from '../../../UnstyledButton/UnstyledButton.js';
import { Badge } from '../../../Badge/Badge.js';

const Tab = /*#__PURE__*/forwardRef(({
  content,
  accessibilityLabel,
  badge,
  id,
  panelID,
  url,
  onAction,
  actions,
  disabled,
  isModalLoading,
  icon,
  siblingTabHasFocus,
  measuring,
  focused,
  selected,
  onToggleModal,
  onTogglePopover,
  viewNames,
  tabIndexOverride,
  onFocus
}, ref) => {
  const i18n = useI18n();
  const [popoverActive, setPopoverActive] = useState(false);
  const [activeModalType, setActiveModalType] = useState(null);
  const {
    mdDown
  } = useBreakpoints();
  const {
    polarisSummerEditions2023: se23
  } = useFeatures();
  const wasSelected = useRef(selected);
  const panelFocused = useRef(false);
  const node = useRef(null);
  useEffect(() => {
    onTogglePopover(popoverActive);
  }, [popoverActive, onTogglePopover]);
  useEffect(() => {
    onToggleModal(Boolean(activeModalType));
  }, [activeModalType, onToggleModal]);
  useEffect(() => {
    return () => {
      onToggleModal(false);
      onTogglePopover(false);
    };
  }, [onToggleModal, onTogglePopover]);

  // A tab can start selected when it is moved from the disclosure dropdown into the main list, so we need to send focus from the tab to the panel on mount and update
  useEffect(() => {
    if (measuring) {
      return;
    }

    // Because of timing issues with the render, we may still have the old, in-disclosure version of the tab that has focus. Check for this as a second indicator of focus
    const itemHadFocus = focused || document.activeElement && document.activeElement.id === id;

    // If we just check for selected, the panel for the active tab will be focused on page load, which we don’t want
    if (itemHadFocus && selected && panelID != null && !panelFocused.current) {
      focusPanelID(panelID);
      panelFocused.current = true;
    }
    if (selected && !wasSelected.current && panelID != null) {
      focusPanelID(panelID);
    } else if (focused && node.current != null && activeModalType == null && !disabled) {
      focusFirstFocusableNode(node.current);
    }
    wasSelected.current = selected;
  }, [focused, id, content, measuring, panelID, selected, activeModalType, disabled]);
  let tabIndex;
  if (selected && !siblingTabHasFocus && !measuring) {
    tabIndex = 0;
  } else if (focused && !measuring) {
    tabIndex = 0;
  } else {
    tabIndex = -1;
  }
  if (tabIndexOverride != null) {
    tabIndex = tabIndexOverride;
  }
  const renameAction = actions?.find(action => action.type === 'rename');
  const duplicateAction = actions?.find(action => action.type === 'duplicate');
  const deleteAction = actions?.find(action => action.type === 'delete');
  const togglePopoverActive = useCallback(() => {
    if (!actions?.length) {
      return;
    }
    setPopoverActive(popoverActive => !popoverActive);
  }, [actions]);
  const handleClick = useCallback(() => {
    if (disabled) {
      return;
    }
    if (selected) {
      togglePopoverActive();
    } else {
      onAction?.();
    }
  }, [selected, onAction, togglePopoverActive, disabled]);
  const handleModalOpen = type => {
    setActiveModalType(type);
  };
  const handleModalClose = () => {
    setActiveModalType(null);
  };
  const handleSaveRenameModal = useCallback(async value => {
    await renameAction?.onPrimaryAction?.(value);
    setTimeout(() => {
      if (node.current) {
        focusFirstFocusableNode(node.current);
      }
    }, 250);
  }, [renameAction]);
  const handleConfirmDeleteView = useCallback(async () => {
    await deleteAction?.onPrimaryAction?.(content);
    handleModalClose();
  }, [deleteAction, content]);
  const handleSaveDuplicateModal = useCallback(async duplicateName => {
    await duplicateAction?.onPrimaryAction?.(duplicateName);
  }, [duplicateAction]);
  const actionContent = {
    rename: {
      icon: InfoMinor,
      content: i18n.translate('Polaris.Tabs.Tab.rename')
    },
    duplicate: {
      icon: DuplicateMinor,
      content: i18n.translate('Polaris.Tabs.Tab.duplicate')
    },
    edit: {
      icon: EditMinor,
      content: i18n.translate('Polaris.Tabs.Tab.edit')
    },
    'edit-columns': {
      icon: Columns3Minor,
      content: i18n.translate('Polaris.Tabs.Tab.editColumns')
    },
    delete: {
      icon: DeleteMinor,
      content: i18n.translate('Polaris.Tabs.Tab.delete'),
      destructive: true
    }
  };
  const formattedActions = actions?.map(({
    type,
    onAction,
    onPrimaryAction,
    ...additionalOptions
  }) => {
    const isModalActivator = !type.includes('edit');
    return {
      ...actionContent[type],
      ...additionalOptions,
      onAction: () => {
        onAction?.(content);
        togglePopoverActive();
        if (isModalActivator) {
          handleModalOpen(type);
        }
      }
    };
  });
  const handleKeyDown = useCallback(event => {
    if (event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  }, [handleClick]);
  const tabContainerClassNames = classNames(styles.TabContainer, selected && styles.Underline);
  const urlIfNotDisabledOrSelected = disabled || selected ? undefined : url;
  const BaseComponent = urlIfNotDisabledOrSelected ? UnstyledLink : UnstyledButton;
  const tabClassName = classNames(styles.Tab, icon && styles['Tab-iconOnly'], popoverActive && styles['Tab-popoverActive'], selected && styles['Tab-active'], selected && actions?.length && styles['Tab-hasActions']);
  const badgeStatusSelected = !se23 ? 'success' : undefined;
  const badgeMarkup = badge ? /*#__PURE__*/React.createElement(Badge, {
    status: selected ? badgeStatusSelected : 'new'
  }, badge) : null;
  const disclosureMarkup = selected && actions?.length ? /*#__PURE__*/React.createElement("div", {
    className: classNames(styles.IconWrap)
  }, /*#__PURE__*/React.createElement(Icon, {
    source: se23 ? ChevronDownMinor : CaretDownMinor
  })) : null;
  const se23LabelVariant = mdDown && se23 ? 'bodyLg' : 'bodySm';
  const labelVariant = mdDown ? 'bodyMd' : 'bodySm';
  const activator = /*#__PURE__*/React.createElement(BaseComponent, {
    id: id,
    className: tabClassName,
    tabIndex: tabIndex,
    "aria-selected": selected,
    "aria-controls": panelID,
    "aria-label": accessibilityLabel,
    role: tabIndexOverride == null ? 'tab' : undefined,
    disabled: disabled,
    url: urlIfNotDisabledOrSelected,
    onFocus: onFocus,
    onMouseUp: handleMouseUpByBlurring,
    onClick: handleClick,
    onKeyDown: handleKeyDown
  }, /*#__PURE__*/React.createElement(HorizontalStack, {
    gap: "2",
    align: "center",
    blockAlign: "center",
    wrap: false
  }, /*#__PURE__*/React.createElement(Text, {
    as: "span",
    variant: se23 ? se23LabelVariant : labelVariant,
    fontWeight: se23 ? 'medium' : 'semibold'
  }, icon ?? content), badgeMarkup), disclosureMarkup);
  const isPlainButton = !selected || !actions?.length;
  const renameModal = renameAction ? /*#__PURE__*/React.createElement(RenameModal, {
    name: content,
    open: activeModalType === 'rename',
    onClose: handleModalClose,
    onClickPrimaryAction: handleSaveRenameModal,
    isModalLoading: isModalLoading,
    viewNames: viewNames
  }) : null;
  const duplicateModal = duplicateAction ? /*#__PURE__*/React.createElement(DuplicateModal, {
    open: activeModalType === 'duplicate',
    name: i18n.translate('Polaris.Tabs.Tab.copy', {
      name: content
    }),
    onClose: handleModalClose,
    onClickPrimaryAction: handleSaveDuplicateModal,
    isModalLoading: isModalLoading,
    viewNames: viewNames || []
  }) : null;
  const deleteModal = deleteAction ? /*#__PURE__*/React.createElement(Modal, {
    open: activeModalType === 'delete',
    onClose: handleModalClose,
    primaryAction: {
      content: i18n.translate('Polaris.Tabs.Tab.deleteModal.delete'),
      onAction: handleConfirmDeleteView,
      destructive: true,
      disabled: isModalLoading
    },
    secondaryActions: [{
      content: i18n.translate('Polaris.Tabs.Tab.deleteModal.cancel'),
      onAction: handleModalClose
    }],
    title: i18n.translate('Polaris.Tabs.Tab.deleteModal.title'),
    instant: true
  }, /*#__PURE__*/React.createElement(Modal.Section, null, i18n.translate('Polaris.Tabs.Tab.deleteModal.description', {
    viewName: content
  }))) : null;
  const markup = isPlainButton || disabled ? activator : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Popover, {
    active: popoverActive,
    activator: activator,
    autofocusTarget: "first-node",
    onClose: togglePopoverActive
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.ActionListWrap
  }, /*#__PURE__*/React.createElement(ActionList, {
    actionRole: "menuitem",
    items: formattedActions
  }))), renameModal, duplicateModal, deleteModal);
  if (icon) {
    return markup;
  }
  return /*#__PURE__*/React.createElement("li", {
    className: tabContainerClassNames,
    ref: mergeRefs([node, ref]),
    role: "presentation"
  }, markup);
});
Tab.displayName = 'Tab';
function focusPanelID(panelID) {
  const panel = document.getElementById(panelID);
  if (panel) {
    panel.focus({
      preventScroll: true
    });
  }
}
function mergeRefs(refs) {
  return node => {
    for (const ref of refs) {
      if (ref != null) {
        ref.current = node;
      }
    }
  };
}

export { Tab };
