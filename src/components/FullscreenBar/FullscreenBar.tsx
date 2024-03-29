import React from 'react';
import {ExitMajor} from '@shopify/polaris-icons';

import {Icon} from '../Icon';
import {Text} from '../Text';
import {useI18n} from '../../utilities/i18n';
import {useFeatures} from '../../utilities/features';

import styles from './FullscreenBar.scss';

export interface FullscreenBarProps {
  /** Callback when back button is clicked */
  onAction: () => void;
  /** Render child elements */
  children?: React.ReactNode;
}

export function FullscreenBar({onAction, children}: FullscreenBarProps) {
  const i18n = useI18n();
  const {polarisSummerEditions2023} = useFeatures();

  const backButtonMarkup = polarisSummerEditions2023 ? (
    <Text as="span" variant="bodyLg">
      {i18n.translate('Polaris.FullscreenBar.back')}
    </Text>
  ) : (
    i18n.translate('Polaris.FullscreenBar.back')
  );

  return (
    <div className={styles.FullscreenBar}>
      <button
        className={styles.BackAction}
        onClick={onAction}
        aria-label={i18n.translate('Polaris.FullscreenBar.accessibilityLabel')}
      >
        <Icon source={ExitMajor} />
        {backButtonMarkup}
      </button>
      {children}
    </div>
  );
}
