import React, { useRef, useState, useCallback, useMemo } from 'react';
import { debounce } from '../../../../utilities/debounce.js';
import { useEventListener } from '../../../../utilities/use-event-listener.js';
import { useIsomorphicLayoutEffect } from '../../../../utilities/use-isomorphic-layout-effect.js';
import styles from './Actions.scss.js';
import { MenuGroup } from '../MenuGroup/MenuGroup.js';
import { ButtonGroup } from '../../../ButtonGroup/ButtonGroup.js';
import { useI18n } from '../../../../utilities/i18n/hooks.js';
import { useFeatures } from '../../../../utilities/features/hooks.js';
import { SecondaryAction } from '../SecondaryAction/SecondaryAction.js';

const ACTION_SPACING = 8;
function Actions({
  actions = [],
  groups = [],
  onActionRollup
}) {
  const i18n = useI18n();
  const actionsLayoutRef = useRef(null);
  const menuGroupWidthRef = useRef(0);
  const availableWidthRef = useRef(0);
  const actionsAndGroupsLengthRef = useRef(0);
  const timesMeasured = useRef(0);
  const actionWidthsRef = useRef([]);
  const rollupActiveRef = useRef(null);
  const {
    polarisSummerEditions2023
  } = useFeatures();
  const [activeMenuGroup, setActiveMenuGroup] = useState(undefined);
  const [measuredActions, setMeasuredActions] = useState({
    showable: [],
    rolledUp: []
  });
  const defaultRollupGroup = {
    title: i18n.translate('Polaris.ActionMenu.Actions.moreActions'),
    actions: []
  };
  const lastMenuGroup = [...groups].pop();
  const lastMenuGroupWidth = [...actionWidthsRef.current].pop() || 0;
  const handleActionsOffsetWidth = useCallback(width => {
    actionWidthsRef.current = [...actionWidthsRef.current, width];
  }, []);
  const handleMenuGroupToggle = useCallback(group => setActiveMenuGroup(activeMenuGroup ? undefined : group), [activeMenuGroup]);
  const handleMenuGroupClose = useCallback(() => setActiveMenuGroup(undefined), []);
  const updateActions = useCallback(() => {
    let actionsAndGroups = [...actions, ...groups];
    if (groups.length > 0) {
      // We don't want to include actions from the last group
      // since it is always rendered with its own actions
      actionsAndGroups = [...actionsAndGroups].slice(0, actionsAndGroups.length - 1);
    }
    setMeasuredActions(currentMeasuredActions => {
      const showable = actionsAndGroups.slice(0, currentMeasuredActions.showable.length);
      const rolledUp = actionsAndGroups.slice(currentMeasuredActions.showable.length, actionsAndGroups.length);
      return {
        showable,
        rolledUp
      };
    });
  }, [actions, groups]);
  const measureActions = useCallback(() => {
    if (actionWidthsRef.current.length === 0 || availableWidthRef.current === 0) {
      return;
    }
    const actionsAndGroups = [...actions, ...groups];
    if (actionsAndGroups.length === 1) {
      setMeasuredActions({
        showable: actionsAndGroups,
        rolledUp: []
      });
      return;
    }
    let currentAvailableWidth = availableWidthRef.current;
    let newShowableActions = [];
    let newRolledUpActions = [];
    actionsAndGroups.forEach((action, index) => {
      const canFitAction = actionWidthsRef.current[index] + menuGroupWidthRef.current + ACTION_SPACING + lastMenuGroupWidth <= currentAvailableWidth;
      if (canFitAction) {
        currentAvailableWidth -= actionWidthsRef.current[index] + ACTION_SPACING * 2;
        newShowableActions = [...newShowableActions, action];
      } else {
        currentAvailableWidth = 0;
        // Find last group if it exists and always render it as a rolled up action below
        if (action === lastMenuGroup) return;
        newRolledUpActions = [...newRolledUpActions, action];
      }
    });
    if (onActionRollup) {
      // Note: Do not include last group actions since we are skipping `lastMenuGroup` above
      // as it is always rendered with its own actions
      const isRollupActive = newShowableActions.length < actionsAndGroups.length - 1;
      if (rollupActiveRef.current !== isRollupActive) {
        onActionRollup(isRollupActive);
        rollupActiveRef.current = isRollupActive;
      }
    }
    setMeasuredActions({
      showable: newShowableActions,
      rolledUp: newRolledUpActions
    });
    timesMeasured.current += 1;
    actionsAndGroupsLengthRef.current = actionsAndGroups.length;
  }, [actions, groups, lastMenuGroup, lastMenuGroupWidth, onActionRollup]);
  const handleResize = useMemo(() => debounce(() => {
    if (!actionsLayoutRef.current) return;
    availableWidthRef.current = actionsLayoutRef.current.offsetWidth;
    // Set timesMeasured to 0 to allow re-measuring
    timesMeasured.current = 0;
    measureActions();
  }, 50, {
    leading: false,
    trailing: true
  }), [measureActions]);
  useEventListener('resize', handleResize);
  useIsomorphicLayoutEffect(() => {
    if (!actionsLayoutRef.current) return;
    availableWidthRef.current = actionsLayoutRef.current.offsetWidth;
    if (
    // Allow measuring twice
    // This accounts for the initial paint and re-flow
    timesMeasured.current >= 2 && [...actions, ...groups].length === actionsAndGroupsLengthRef.current) {
      updateActions();
      return;
    }
    measureActions();
  }, [actions, groups, measureActions, updateActions]);
  const actionsMarkup = actions.map(action => {
    if (measuredActions.showable.length > 0 || measuredActions.rolledUp.includes(action)) return null;
    const {
      content,
      onAction,
      ...rest
    } = action;
    return /*#__PURE__*/React.createElement(SecondaryAction, Object.assign({
      key: content,
      onClick: onAction
    }, rest, {
      getOffsetWidth: handleActionsOffsetWidth
    }), content);
  });
  const rollUppableActionsMarkup = measuredActions.showable.length > 0 ? measuredActions.showable.map(action => action.content && /*#__PURE__*/React.createElement(SecondaryAction, Object.assign({
    key: action.content
  }, action, {
    getOffsetWidth: handleActionsOffsetWidth
  }), action.content)) : null;
  const filteredGroups = [...groups, defaultRollupGroup].filter(group => {
    return groups.length === 0 ? group : group === lastMenuGroup || !measuredActions.rolledUp.some(rolledUpGroup => isMenuGroup(rolledUpGroup) && rolledUpGroup.title === group.title);
  });
  const groupsMarkup = filteredGroups.map(group => {
    const {
      title,
      actions: groupActions,
      ...rest
    } = group;
    const isDefaultGroup = group === defaultRollupGroup;
    const isLastMenuGroup = group === lastMenuGroup;
    const [finalRolledUpActions, finalRolledUpSectionGroups] = measuredActions.rolledUp.reduce(([actions, sections], action) => {
      if (isMenuGroup(action)) {
        sections.push({
          title: action.title,
          items: action.actions.map(sectionAction => ({
            ...sectionAction,
            disabled: action.disabled || sectionAction.disabled
          }))
        });
      } else {
        actions.push(action);
      }
      return [actions, sections];
    }, [[], []]);
    if (!isDefaultGroup && !isLastMenuGroup) {
      // Render a normal MenuGroup with just its actions
      return /*#__PURE__*/React.createElement(MenuGroup, Object.assign({
        key: title,
        title: title,
        active: title === activeMenuGroup,
        actions: groupActions
      }, rest, {
        onOpen: handleMenuGroupToggle,
        onClose: handleMenuGroupClose,
        getOffsetWidth: handleActionsOffsetWidth
      }));
    } else if (!isDefaultGroup && isLastMenuGroup) {
      // render the last, rollup group with its actions and finalRolledUpActions
      return /*#__PURE__*/React.createElement(MenuGroup, Object.assign({
        key: title,
        title: title,
        active: title === activeMenuGroup,
        actions: [...finalRolledUpActions, ...groupActions],
        sections: finalRolledUpSectionGroups
      }, rest, {
        onOpen: handleMenuGroupToggle,
        onClose: handleMenuGroupClose,
        getOffsetWidth: handleActionsOffsetWidth
      }));
    } else if (isDefaultGroup && groups.length === 0 && finalRolledUpActions.length) {
      // Render the default group to rollup into if one does not exist
      return /*#__PURE__*/React.createElement(MenuGroup, Object.assign({
        key: title,
        title: title,
        active: title === activeMenuGroup,
        actions: finalRolledUpActions,
        sections: finalRolledUpSectionGroups
      }, rest, {
        onOpen: handleMenuGroupToggle,
        onClose: handleMenuGroupClose,
        getOffsetWidth: handleActionsOffsetWidth
      }));
    }
  });
  const groupedActionsMarkup = /*#__PURE__*/React.createElement(ButtonGroup, {
    spacing: polarisSummerEditions2023 ? 'tight' : 'extraTight'
  }, rollUppableActionsMarkup, actionsMarkup, groupsMarkup);
  return /*#__PURE__*/React.createElement("div", {
    className: styles.ActionsLayout,
    ref: actionsLayoutRef
  }, groupedActionsMarkup);
}
function isMenuGroup(actionOrMenuGroup) {
  return 'title' in actionOrMenuGroup;
}

export { Actions };
