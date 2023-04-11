import { AiFillCaretDown } from 'react-icons/ai';
import DataTable from 'react-data-table-component';
import { ConditionalStyles, PaginationChangePage, RowState } from 'react-data-table-component/dist/src/DataTable/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Generic = any;

interface DataTableComponentProps {
  columns: Array<Generic>;
  gridData: Array<Generic>;
  selectableRows?: boolean;
  expandableRows?: boolean;
  expandedColumns?: Array<Generic>;
  expandedGridData?: Array<Generic>;
  handleRowsChange?: (rows: Generic) => void;
  preSelected?: RowState<Generic>;
  noRowsPerPage?: boolean;
  paginationTotalRows?: number;
  onRowClicked?: (row: Generic, e: React.MouseEvent<Element, MouseEvent>) => void;
  highlightOnHover?: boolean;
  pointerOnHover?: boolean;
  conditionalRowStyles?: ConditionalStyles<Generic>[];
  subHeader?: boolean;
  subHeaderComponent?: React.ReactNode | React.ReactNode[];
  progressPending?: boolean;
  progressComponent?: React.ReactNode;
  defaultSortFieldId?: string | number | null;
  expandableRowsComponent?: ({ data }: Generic) => JSX.Element | null;
  onChangePage?: PaginationChangePage;
}

const DataTableComponent: React.FC<DataTableComponentProps> = props => {
  const {
    columns,
    gridData,
    expandedColumns,
    expandedGridData,
    selectableRows = false,
    expandableRows = false,
    handleRowsChange,
    preSelected,
    noRowsPerPage = false,
    paginationTotalRows,
    onRowClicked,
    highlightOnHover = false,
    pointerOnHover = false,
    conditionalRowStyles,
    subHeader = false,
    subHeaderComponent,
    progressPending,
    progressComponent,
    defaultSortFieldId,
    expandableRowsComponent,
    onChangePage,
  } = props;

  const ExpandedComponent = ({ data }: Generic) => {
    if (expandableRows && expandedColumns && (data || expandedGridData)) {
      return <DataTable noHeader data={data?.questions || data?.response} columns={expandedColumns} className='react-dataTable' />;
    } else {
      return <pre>{JSON.stringify(data, null, 2)}</pre>;
    }
  };

  const paginationComponentOptions = { noRowsPerPage };

  return (
    <DataTable
      noHeader
      pagination
      data={gridData}
      columns={columns}
      className='react-dataTable'
      selectableRows={selectableRows}
      expandableRows={expandableRows}
      defaultSortFieldId={defaultSortFieldId}
      defaultSortAsc={false}
      sortIcon={<AiFillCaretDown size={10} />}
      onSelectedRowsChange={handleRowsChange}
      expandableRowsComponent={expandableRowsComponent || ExpandedComponent}
      selectableRowSelected={preSelected}
      paginationComponentOptions={paginationComponentOptions}
      onRowClicked={onRowClicked}
      highlightOnHover={highlightOnHover}
      pointerOnHover={pointerOnHover}
      conditionalRowStyles={conditionalRowStyles}
      subHeader={subHeader}
      progressComponent={progressComponent}
      subHeaderComponent={subHeaderComponent}
      progressPending={progressPending}
      paginationTotalRows={paginationTotalRows}
      onChangePage={onChangePage}
    />
  );
};

export default DataTableComponent;
