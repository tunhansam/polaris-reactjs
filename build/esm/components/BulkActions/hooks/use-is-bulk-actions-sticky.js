import { useState, useRef, useCallback, useEffect } from 'react';
import { debounce } from '../../../utilities/debounce.js';

const DEBOUNCE_PERIOD = 250;
const PADDING_IN_SELECT_MODE = 92;
function useIsBulkActionsSticky(selectMode) {
  const hasIOSupport = typeof window !== 'undefined' && Boolean(window.IntersectionObserver);
  const [isBulkActionsSticky, setIsSticky] = useState(false);
  const [bulkActionsAbsoluteOffset, setBulkActionsAbsoluteOffset] = useState(0);
  const [bulkActionsMaxWidth, setBulkActionsMaxWidth] = useState(0);
  const [bulkActionsOffsetLeft, setBulkActionsOffsetLeft] = useState(0);
  const bulkActionsIntersectionRef = useRef(null);
  const tableMeasurerRef = useRef(null);
  const handleIntersect = entries => {
    entries.forEach(entry => {
      setIsSticky(!entry.isIntersecting);
    });
  };
  const options = {
    root: null,
    rootMargin: '-12px',
    threshold: 0
  };
  const observerRef = useRef(hasIOSupport ? new IntersectionObserver(handleIntersect, options) : null);
  const computeTableDimensions = useCallback(() => {
    const node = tableMeasurerRef.current;
    if (!node) {
      return {
        maxWidth: 0,
        offsetHeight: 0,
        offsetLeft: 0
      };
    }
    const box = node.getBoundingClientRect();
    const paddingHeight = selectMode ? PADDING_IN_SELECT_MODE : 0;
    const offsetHeight = box.height - paddingHeight;
    const maxWidth = box.width;
    const offsetLeft = box.left;
    setBulkActionsAbsoluteOffset(offsetHeight);
    setBulkActionsMaxWidth(maxWidth);
    setBulkActionsOffsetLeft(offsetLeft);
  }, [selectMode]);
  useEffect(() => {
    computeTableDimensions();
    const debouncedComputeTableHeight = debounce(computeTableDimensions, DEBOUNCE_PERIOD, {
      trailing: true
    });
    window.addEventListener('resize', debouncedComputeTableHeight);
    return () => window.removeEventListener('resize', debouncedComputeTableHeight);
  }, [computeTableDimensions]);
  useEffect(() => {
    const observer = observerRef.current;
    if (!observer) {
      return;
    }
    const node = bulkActionsIntersectionRef.current;
    if (node) {
      observer.observe(node);
    }
    return () => {
      observer?.disconnect();
    };
  }, [bulkActionsIntersectionRef]);
  return {
    bulkActionsIntersectionRef,
    tableMeasurerRef,
    isBulkActionsSticky,
    bulkActionsAbsoluteOffset,
    bulkActionsMaxWidth,
    bulkActionsOffsetLeft,
    computeTableDimensions
  };
}

export { useIsBulkActionsSticky };
