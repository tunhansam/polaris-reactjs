'use strict';

var React = require('react');
var isEqual = require('react-fast-compare');
var debounce = require('../../utilities/debounce.js');
var css = require('../../utilities/css.js');
var shared = require('../shared.js');
var utilities = require('./utilities.js');
var DataTable$1 = require('./DataTable.scss.js');
var Cell = require('./components/Cell/Cell.js');
var AfterInitialMount = require('../AfterInitialMount/AfterInitialMount.js');
var Sticky = require('../Sticky/Sticky.js');
var Navigation = require('./components/Navigation/Navigation.js');
var hooks = require('../../utilities/i18n/hooks.js');
var EventListener = require('../EventListener/EventListener.js');

const getRowClientHeights = rows => {
  const heights = [];
  if (!rows) {
    return heights;
  }
  rows.forEach(row => {
    heights.push(row.clientHeight);
  });
  return heights;
};
class DataTableInner extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      condensed: false,
      columnVisibilityData: [],
      isScrolledFarthestLeft: true,
      isScrolledFarthestRight: false,
      rowHovered: undefined
    };
    this.dataTable = /*#__PURE__*/React.createRef();
    this.scrollContainer = /*#__PURE__*/React.createRef();
    this.table = /*#__PURE__*/React.createRef();
    this.stickyTable = /*#__PURE__*/React.createRef();
    this.stickyNav = null;
    this.headerNav = null;
    this.tableHeadings = [];
    this.stickyHeadings = [];
    this.tableHeadingWidths = [];
    this.stickyHeaderActive = false;
    this.scrollStopTimer = null;
    this.handleResize = debounce.debounce(() => {
      const {
        table: {
          current: table
        },
        scrollContainer: {
          current: scrollContainer
        }
      } = this;
      let condensed = false;
      if (table && scrollContainer) {
        // safari sometimes incorrectly sets the scrollwidth too large by 1px
        condensed = table.scrollWidth > scrollContainer.clientWidth + 1;
      }
      this.setState({
        condensed,
        ...this.calculateColumnVisibilityData(condensed)
      });
    });
    this.setCellRef = ({
      ref,
      index,
      inStickyHeader
    }) => {
      if (ref == null) {
        return;
      }
      if (inStickyHeader) {
        this.stickyHeadings[index] = ref;
        const button = ref.querySelector('button');
        if (button == null) {
          return;
        }
        button.addEventListener('focus', this.handleHeaderButtonFocus);
      } else {
        this.tableHeadings[index] = ref;
        this.tableHeadingWidths[index] = ref.clientWidth;
      }
    };
    this.changeHeadingFocus = () => {
      const {
        tableHeadings,
        stickyHeadings,
        stickyNav,
        headerNav
      } = this;
      const stickyFocusedItemIndex = stickyHeadings.findIndex(item => item === document.activeElement?.parentElement);
      const tableFocusedItemIndex = tableHeadings.findIndex(item => item === document.activeElement?.parentElement);
      const arrowsInStickyNav = stickyNav?.querySelectorAll('button');
      const arrowsInHeaderNav = headerNav?.querySelectorAll('button');
      let stickyFocusedNavIndex = -1;
      arrowsInStickyNav?.forEach((item, index) => {
        if (item === document.activeElement) {
          stickyFocusedNavIndex = index;
        }
      });
      let headerFocusedNavIndex = -1;
      arrowsInHeaderNav?.forEach((item, index) => {
        if (item === document.activeElement) {
          headerFocusedNavIndex = index;
        }
      });
      if (stickyFocusedItemIndex < 0 && tableFocusedItemIndex < 0 && stickyFocusedNavIndex < 0 && headerFocusedNavIndex < 0) {
        return null;
      }
      let button;
      if (stickyFocusedItemIndex >= 0) {
        button = tableHeadings[stickyFocusedItemIndex].querySelector('button');
      } else if (tableFocusedItemIndex >= 0) {
        button = stickyHeadings[tableFocusedItemIndex].querySelector('button');
      }
      if (stickyFocusedNavIndex >= 0) {
        button = arrowsInHeaderNav?.[stickyFocusedNavIndex];
      } else if (headerFocusedNavIndex >= 0) {
        button = arrowsInStickyNav?.[headerFocusedNavIndex];
      }
      if (button == null) {
        return null;
      }
      button.style.visibility = 'visible';
      button.focus();
      button.style.removeProperty('visibility');
    };
    this.calculateColumnVisibilityData = condensed => {
      const fixedFirstColumns = this.fixedFirstColumns();
      const {
        table: {
          current: table
        },
        scrollContainer: {
          current: scrollContainer
        },
        dataTable: {
          current: dataTable
        }
      } = this;
      const {
        stickyHeader
      } = this.props;
      if ((stickyHeader || condensed) && table && scrollContainer && dataTable) {
        const headerCells = table.querySelectorAll(shared.headerCell.selector);
        const rightMostHeader = headerCells[fixedFirstColumns - 1];
        const nthColumnWidth = fixedFirstColumns ? rightMostHeader.offsetLeft + rightMostHeader.offsetWidth : 0;
        if (headerCells.length > 0) {
          const firstVisibleColumnIndex = headerCells.length - 1;
          const tableLeftVisibleEdge = scrollContainer.scrollLeft + nthColumnWidth;
          const tableRightVisibleEdge = scrollContainer.scrollLeft + dataTable.offsetWidth;
          const tableData = {
            firstVisibleColumnIndex,
            tableLeftVisibleEdge,
            tableRightVisibleEdge
          };
          const columnVisibilityData = [...headerCells].map(utilities.measureColumn(tableData));
          const lastColumn = columnVisibilityData[columnVisibilityData.length - 1];
          const isScrolledFarthestLeft = fixedFirstColumns ? tableLeftVisibleEdge === nthColumnWidth : tableLeftVisibleEdge === 0;
          return {
            columnVisibilityData,
            ...utilities.getPrevAndCurrentColumns(tableData, columnVisibilityData),
            isScrolledFarthestLeft,
            isScrolledFarthestRight: lastColumn.rightEdge <= tableRightVisibleEdge
          };
        }
      }
      return {
        columnVisibilityData: [],
        previousColumn: undefined,
        currentColumn: undefined
      };
    };
    this.handleHeaderButtonFocus = event => {
      const fixedFirstColumns = this.fixedFirstColumns();
      if (this.scrollContainer.current == null || event.target == null || this.state.columnVisibilityData.length === 0) {
        return;
      }
      const target = event.target;
      const currentCell = target.parentNode;
      const tableScrollLeft = this.scrollContainer.current.scrollLeft;
      const tableViewableWidth = this.scrollContainer.current.offsetWidth;
      const tableRightEdge = tableScrollLeft + tableViewableWidth;
      const nthColumnWidth = this.state.columnVisibilityData.length > 0 ? this.state.columnVisibilityData[fixedFirstColumns]?.rightEdge : 0;
      const currentColumnLeftEdge = currentCell.offsetLeft;
      const currentColumnRightEdge = currentCell.offsetLeft + currentCell.offsetWidth;
      if (tableScrollLeft > currentColumnLeftEdge - nthColumnWidth) {
        this.scrollContainer.current.scrollLeft = currentColumnLeftEdge - nthColumnWidth;
      }
      if (currentColumnRightEdge > tableRightEdge) {
        this.scrollContainer.current.scrollLeft = currentColumnRightEdge - tableViewableWidth;
      }
    };
    this.stickyHeaderScrolling = () => {
      const {
        current: stickyTable
      } = this.stickyTable;
      const {
        current: scrollContainer
      } = this.scrollContainer;
      if (stickyTable == null || scrollContainer == null) {
        return;
      }
      stickyTable.scrollLeft = scrollContainer.scrollLeft;
    };
    this.scrollListener = () => {
      if (this.scrollStopTimer) {
        clearTimeout(this.scrollStopTimer);
      }
      this.scrollStopTimer = setTimeout(() => {
        this.setState(prevState => ({
          ...this.calculateColumnVisibilityData(prevState.condensed)
        }));
      }, 100);
      this.setState({
        isScrolledFarthestLeft: this.scrollContainer.current?.scrollLeft === 0
      });
      if (this.props.stickyHeader && this.stickyHeaderActive) {
        this.stickyHeaderScrolling();
      }
    };
    this.handleHover = row => () => {
      this.setState({
        rowHovered: row
      });
    };
    this.handleFocus = event => {
      const fixedFirstColumns = this.fixedFirstColumns();
      if (this.scrollContainer.current == null || event.target == null) {
        return;
      }
      const currentCell = event.target.parentNode;
      const fixedNthColumn = this.props;
      const nthColumnWidth = fixedNthColumn ? this.state.columnVisibilityData[fixedFirstColumns]?.rightEdge : 0;
      const currentColumnLeftEdge = currentCell.offsetLeft;
      const desiredScrollLeft = currentColumnLeftEdge - nthColumnWidth;
      if (this.scrollContainer.current.scrollLeft > desiredScrollLeft) {
        this.scrollContainer.current.scrollLeft = desiredScrollLeft;
      }

      // focus fixed first column if present
    };
    this.navigateTable = direction => {
      const fixedFirstColumns = this.fixedFirstColumns();
      const {
        currentColumn,
        previousColumn
      } = this.state;
      const nthColumnWidth = this.state.columnVisibilityData[fixedFirstColumns - 1]?.rightEdge;
      if (!currentColumn || !previousColumn) {
        return;
      }
      let prevWidths = 0;
      for (let index = 0; index < currentColumn.index; index++) {
        prevWidths += this.state.columnVisibilityData[index].width;
      }
      const {
        current: scrollContainer
      } = this.scrollContainer;
      const handleScroll = () => {
        let newScrollLeft = 0;
        if (fixedFirstColumns) {
          newScrollLeft = direction === 'right' ? prevWidths - nthColumnWidth + currentColumn.width : prevWidths - previousColumn.width - nthColumnWidth;
        } else {
          newScrollLeft = direction === 'right' ? currentColumn.rightEdge : previousColumn.leftEdge;
        }
        if (scrollContainer) {
          scrollContainer.scrollLeft = newScrollLeft;
          requestAnimationFrame(() => {
            this.setState(prevState => ({
              ...this.calculateColumnVisibilityData(prevState.condensed)
            }));
          });
        }
      };
      return handleScroll;
    };
    this.renderHeading = ({
      heading,
      headingIndex,
      inFixedNthColumn,
      inStickyHeader
    }) => {
      const {
        sortable,
        truncate = false,
        columnContentTypes,
        defaultSortDirection,
        initialSortColumnIndex = 0,
        verticalAlign,
        firstColumnMinWidth
      } = this.props;
      const fixedFirstColumns = this.fixedFirstColumns();
      const {
        sortDirection = defaultSortDirection,
        sortedColumnIndex = initialSortColumnIndex,
        isScrolledFarthestLeft
      } = this.state;
      let sortableHeadingProps;
      const headingCellId = `heading-cell-${headingIndex}`;
      const stickyHeaderId = `stickyheader-${headingIndex}`;
      const id = inStickyHeader ? stickyHeaderId : headingCellId;
      if (sortable) {
        const isSortable = sortable[headingIndex];
        const isSorted = isSortable && sortedColumnIndex === headingIndex;
        const direction = isSorted ? sortDirection : 'none';
        sortableHeadingProps = {
          defaultSortDirection,
          sorted: isSorted,
          sortable: isSortable,
          sortDirection: direction,
          onSort: this.defaultOnSort(headingIndex),
          fixedNthColumn: fixedFirstColumns,
          inFixedNthColumn: fixedFirstColumns
        };
      }
      const stickyCellWidth = inStickyHeader ? this.tableHeadingWidths[headingIndex] : undefined;
      const fixedCellVisible = !isScrolledFarthestLeft;
      const cellProps = {
        header: true,
        stickyHeadingCell: inStickyHeader,
        content: heading,
        contentType: columnContentTypes[headingIndex],
        nthColumn: headingIndex < fixedFirstColumns,
        fixedFirstColumns,
        truncate,
        headingIndex,
        ...sortableHeadingProps,
        verticalAlign,
        handleFocus: this.handleFocus,
        stickyCellWidth,
        fixedCellVisible,
        firstColumnMinWidth
      };
      if (inFixedNthColumn && inStickyHeader) {
        // need two cells for fixed first column (actual cell and the overlapping one)
        // the sticky cell is second so that the index is associated with the sticky
        // cell and not the underlying one. This helps `changeHeadingFocus` to put
        // focus on the right cell when switching from sticky to non-sticky headers
        return [/*#__PURE__*/React.createElement(Cell.Cell, Object.assign({
          key: id
        }, cellProps, {
          setRef: ref => {
            this.setCellRef({
              ref,
              index: headingIndex,
              inStickyHeader
            });
          },
          inFixedNthColumn: false
        })), /*#__PURE__*/React.createElement(Cell.Cell, Object.assign({
          key: `${id}-sticky`
        }, cellProps, {
          setRef: ref => {
            this.setCellRef({
              ref,
              index: headingIndex,
              inStickyHeader
            });
          },
          inFixedNthColumn: Boolean(fixedFirstColumns),
          lastFixedFirstColumn: headingIndex === fixedFirstColumns - 1,
          style: {
            left: this.state.columnVisibilityData[headingIndex]?.leftEdge
          }
        }))];
      }
      return /*#__PURE__*/React.createElement(Cell.Cell, Object.assign({
        key: id
      }, cellProps, {
        setRef: ref => {
          this.setCellRef({
            ref,
            index: headingIndex,
            inStickyHeader
          });
        },
        lastFixedFirstColumn: headingIndex === fixedFirstColumns - 1,
        inFixedNthColumn: inFixedNthColumn
      }));
    };
    this.totalsRowHeading = () => {
      const {
        i18n,
        totals,
        totalsName
      } = this.props;
      const totalsLabel = totalsName ? totalsName : {
        singular: i18n.translate('Polaris.DataTable.totalRowHeading'),
        plural: i18n.translate('Polaris.DataTable.totalsRowHeading')
      };
      return totals && totals.filter(total => total !== '').length > 1 ? totalsLabel.plural : totalsLabel.singular;
    };
    this.renderTotals = ({
      total,
      index
    }) => {
      const fixedFirstColumns = this.fixedFirstColumns();
      const id = `totals-cell-${index}`;
      const {
        truncate = false,
        verticalAlign,
        columnContentTypes
      } = this.props;
      let content;
      let contentType;
      if (index === 0) {
        content = this.totalsRowHeading();
      }
      if (total !== '' && index > 0) {
        contentType = columnContentTypes[index];
        content = total;
      }
      const totalInFooter = this.props.showTotalsInFooter;
      return /*#__PURE__*/React.createElement(Cell.Cell, {
        total: true,
        totalInFooter: totalInFooter,
        nthColumn: index <= fixedFirstColumns - 1,
        firstColumn: index === 0,
        key: id,
        content: content,
        contentType: contentType,
        truncate: truncate,
        verticalAlign: verticalAlign
      });
    };
    this.getColSpan = (rowLength, headingsLength, contentTypesLength, cellIndex) => {
      // We decided that it shouldn't be possible to have fixed "n" columns and content that spans multiple columns
      const fixedFirstColumns = this.fixedFirstColumns();
      if (fixedFirstColumns) {
        return 1;
      }
      const rowLen = rowLength ? rowLength : 1;
      const colLen = headingsLength ? headingsLength : contentTypesLength;
      const colSpan = Math.floor(colLen / rowLen);
      const remainder = colLen % rowLen;
      return cellIndex === 0 ? colSpan + remainder : colSpan;
    };
    this.defaultRenderRow = ({
      row,
      index,
      inFixedNthColumn,
      rowHeights
    }) => {
      const {
        columnContentTypes,
        truncate = false,
        verticalAlign,
        hoverable = true,
        headings
      } = this.props;
      const {
        condensed
      } = this.state;
      const fixedFirstColumns = this.fixedFirstColumns();
      const className = css.classNames(DataTable$1.default.TableRow, hoverable && DataTable$1.default.hoverable);
      return /*#__PURE__*/React.createElement("tr", {
        key: `row-${index}`,
        className: className,
        onMouseEnter: this.handleHover(index),
        onMouseLeave: this.handleHover()
      }, row.map((content, cellIndex) => {
        const hovered = index === this.state.rowHovered;
        const id = `cell-${cellIndex}-row-${index}`;
        const colSpan = this.getColSpan(row.length, headings.length, columnContentTypes.length, cellIndex);
        return /*#__PURE__*/React.createElement(Cell.Cell, {
          key: id,
          content: content,
          contentType: columnContentTypes[cellIndex],
          nthColumn: cellIndex <= fixedFirstColumns - 1,
          firstColumn: cellIndex === 0,
          truncate: truncate,
          verticalAlign: verticalAlign,
          colSpan: colSpan,
          hovered: hovered,
          style: rowHeights ? {
            height: `${rowHeights[index]}px`
          } : {},
          inFixedNthColumn: condensed && inFixedNthColumn
        });
      }));
    };
    this.defaultOnSort = headingIndex => {
      const {
        onSort,
        defaultSortDirection = 'ascending',
        initialSortColumnIndex
      } = this.props;
      const {
        sortDirection = defaultSortDirection,
        sortedColumnIndex = initialSortColumnIndex
      } = this.state;
      let newSortDirection = defaultSortDirection;
      if (sortedColumnIndex === headingIndex) {
        newSortDirection = sortDirection === 'ascending' ? 'descending' : 'ascending';
      }
      const handleSort = () => {
        this.setState({
          sortDirection: newSortDirection,
          sortedColumnIndex: headingIndex
        }, () => {
          if (onSort) {
            onSort(headingIndex, newSortDirection);
          }
        });
      };
      return handleSort;
    };
  }
  componentDidMount() {
    // We need to defer the calculation in development so the styles have time to be injected.
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        this.handleResize();
      }, 10);
    } else {
      this.handleResize();
    }
  }
  componentDidUpdate(prevProps) {
    if (isEqual(prevProps, this.props)) {
      return;
    }
    this.handleResize();
  }
  componentWillUnmount() {
    this.handleResize.cancel();
  }
  render() {
    const {
      headings,
      totals,
      showTotalsInFooter,
      rows,
      footerContent,
      hideScrollIndicator = false,
      increasedTableDensity = false,
      hasZebraStripingOnData = false,
      stickyHeader = false,
      hasFixedFirstColumn: fixedFirstColumn = false
    } = this.props;
    const {
      condensed,
      columnVisibilityData,
      isScrolledFarthestLeft,
      isScrolledFarthestRight
    } = this.state;
    if (fixedFirstColumn && process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn('Deprecation: The `hasFixedFirstColumn` prop on the `DataTable` has been deprecated. Use fixedFirstColumns={n} instead.');
    }
    const fixedFirstColumns = this.fixedFirstColumns();
    const rowCountIsEven = rows.length % 2 === 0;
    const className = css.classNames(DataTable$1.default.DataTable, condensed && DataTable$1.default.condensed, totals && DataTable$1.default.ShowTotals, showTotalsInFooter && DataTable$1.default.ShowTotalsInFooter, hasZebraStripingOnData && DataTable$1.default.ZebraStripingOnData, hasZebraStripingOnData && rowCountIsEven && DataTable$1.default.RowCountIsEven);
    const wrapperClassName = css.classNames(DataTable$1.default.TableWrapper, condensed && DataTable$1.default.condensed, increasedTableDensity && DataTable$1.default.IncreasedTableDensity, stickyHeader && DataTable$1.default.StickyHeaderEnabled);
    const headingMarkup = /*#__PURE__*/React.createElement("tr", null, headings.map((heading, index) => this.renderHeading({
      heading,
      headingIndex: index,
      inFixedNthColumn: false,
      inStickyHeader: false
    })));
    const totalsMarkup = totals ? /*#__PURE__*/React.createElement("tr", null, totals.map((total, index) => this.renderTotals({
      total,
      index
    }))) : null;
    const nthColumns = rows.map(row => row.slice(0, fixedFirstColumns));
    const nthHeadings = headings.slice(0, fixedFirstColumns);
    const nthTotals = totals?.slice(0, fixedFirstColumns);
    const tableHeaderRows = this.table.current?.children[0].childNodes;
    const tableBodyRows = this.table.current?.children[1].childNodes;
    const headerRowHeights = getRowClientHeights(tableHeaderRows);
    const bodyRowHeights = getRowClientHeights(tableBodyRows);
    const fixedNthColumnMarkup = condensed && fixedFirstColumns !== 0 && /*#__PURE__*/React.createElement("table", {
      className: css.classNames(DataTable$1.default.FixedFirstColumn, !isScrolledFarthestLeft && DataTable$1.default.separate),
      style: {
        width: `${columnVisibilityData[fixedFirstColumns - 1]?.rightEdge}px`
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
      style: {
        height: `${headerRowHeights[0]}px`
      }
    }, nthHeadings.map((heading, index) => this.renderHeading({
      heading,
      headingIndex: index,
      inFixedNthColumn: true,
      inStickyHeader: false
    }))), totals && !showTotalsInFooter && /*#__PURE__*/React.createElement("tr", {
      style: {
        height: `${headerRowHeights[1]}px`
      }
    }, nthTotals?.map((total, index) => this.renderTotals({
      total,
      index
    })))), /*#__PURE__*/React.createElement("tbody", null, nthColumns.map((row, index) => this.defaultRenderRow({
      row,
      index,
      inFixedNthColumn: true,
      rowHeights: bodyRowHeights
    }))), totals && showTotalsInFooter && /*#__PURE__*/React.createElement("tfoot", null, /*#__PURE__*/React.createElement("tr", null, nthTotals?.map((total, index) => this.renderTotals({
      total,
      index
    })))));
    const bodyMarkup = rows.map((row, index) => this.defaultRenderRow({
      row,
      index,
      inFixedNthColumn: false
    }));
    const footerMarkup = footerContent ? /*#__PURE__*/React.createElement("div", {
      className: DataTable$1.default.Footer
    }, footerContent) : null;
    const headerTotalsMarkup = !showTotalsInFooter ? totalsMarkup : null;
    const footerTotalsMarkup = showTotalsInFooter ? /*#__PURE__*/React.createElement("tfoot", null, totalsMarkup) : null;
    const navigationMarkup = location => hideScrollIndicator ? null : /*#__PURE__*/React.createElement(Navigation.Navigation, {
      columnVisibilityData: columnVisibilityData,
      isScrolledFarthestLeft: isScrolledFarthestLeft,
      isScrolledFarthestRight: isScrolledFarthestRight,
      navigateTableLeft: this.navigateTable('left'),
      navigateTableRight: this.navigateTable('right'),
      fixedFirstColumns: fixedFirstColumns,
      setRef: ref => {
        if (location === 'header') {
          this.headerNav = ref;
        } else if (location === 'sticky') {
          this.stickyNav = ref;
        }
      }
    });
    const stickyHeaderMarkup = stickyHeader ? /*#__PURE__*/React.createElement(AfterInitialMount.AfterInitialMount, null, /*#__PURE__*/React.createElement("div", {
      className: DataTable$1.default.StickyHeaderWrapper,
      role: "presentation"
    }, /*#__PURE__*/React.createElement(Sticky.Sticky, {
      boundingElement: this.dataTable.current,
      onStickyChange: isSticky => {
        this.changeHeadingFocus();
        this.stickyHeaderActive = isSticky;
      }
    }, isSticky => {
      const stickyHeaderInnerClassNames = css.classNames(DataTable$1.default.StickyHeaderInner, isSticky && DataTable$1.default['StickyHeaderInner-isSticky']);
      const stickyHeaderTableClassNames = css.classNames(DataTable$1.default.StickyHeaderTable, !isScrolledFarthestLeft && DataTable$1.default.separate);
      return /*#__PURE__*/React.createElement("div", {
        className: stickyHeaderInnerClassNames
      }, /*#__PURE__*/React.createElement("div", null, navigationMarkup('sticky')), /*#__PURE__*/React.createElement("table", {
        className: stickyHeaderTableClassNames,
        ref: this.stickyTable
      }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
        className: DataTable$1.default.StickyTableHeadingsRow
      }, headings.map((heading, index) => {
        return this.renderHeading({
          heading,
          headingIndex: index,
          inFixedNthColumn: Boolean(index <= fixedFirstColumns - 1 && fixedFirstColumns),
          inStickyHeader: true
        });
      })))));
    }))) : null;
    return /*#__PURE__*/React.createElement("div", {
      className: wrapperClassName,
      ref: this.dataTable
    }, stickyHeaderMarkup, navigationMarkup('header'), /*#__PURE__*/React.createElement("div", {
      className: className
    }, /*#__PURE__*/React.createElement("div", {
      className: DataTable$1.default.ScrollContainer,
      ref: this.scrollContainer
    }, /*#__PURE__*/React.createElement(EventListener.EventListener, {
      event: "resize",
      handler: this.handleResize
    }), /*#__PURE__*/React.createElement(EventListener.EventListener, {
      capture: true,
      passive: true,
      event: "scroll",
      handler: this.scrollListener
    }), fixedNthColumnMarkup, /*#__PURE__*/React.createElement("table", {
      className: DataTable$1.default.Table,
      ref: this.table
    }, /*#__PURE__*/React.createElement("thead", null, headingMarkup, headerTotalsMarkup), /*#__PURE__*/React.createElement("tbody", null, bodyMarkup), footerTotalsMarkup)), footerMarkup));
  }
  fixedFirstColumns() {
    const {
      hasFixedFirstColumn,
      fixedFirstColumns = 0,
      headings
    } = this.props;
    const numberOfFixedFirstColumns = hasFixedFirstColumn && !fixedFirstColumns ? 1 : fixedFirstColumns;
    if (numberOfFixedFirstColumns >= headings.length) {
      return 0;
    }
    return numberOfFixedFirstColumns;
  }
}
function DataTable(props) {
  const i18n = hooks.useI18n();
  return /*#__PURE__*/React.createElement(DataTableInner, Object.assign({}, props, {
    i18n: i18n
  }));
}

exports.DataTable = DataTable;
