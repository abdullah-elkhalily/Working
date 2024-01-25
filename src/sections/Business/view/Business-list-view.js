import isEqual from 'lodash/isEqual';
import { useState, useEffect, useCallback } from 'react';
// @mui
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// _mock
import { PRODUCT_STOCK_OPTIONS } from 'src/_mock';
// api
import { useGetBusiness, deleteBusiness} from 'src/api/Business';
// components
import { useSettingsContext } from 'src/components/settings';
import {
  useTable,
  getComparator,
  // emptyRows,
  TableNoData,
  TableSkeleton,
  // TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import BusinessTableRow from '../Business-table-row';
import BusinessTableToolbar from '../Business-table-toolbar';
import BusinessTableFiltersResult from '../Business-table-filters-result';
import logo from 'src/components/logo';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Store' , maxWidth: 40},
  { id: 'status', label: 'Status', width: 110 },
  { id: 'address', label: 'Address', width: 140 },
  { id: 'country', label: 'Country', width: 140 },
  { id: 'mobile_number', label: 'Mobile_Number', width: 140 },
  { id: 'no_of_orders', label: 'Orders', width: 140 },
  { id: '', width: 88 },


  // { id: 'feedbackRateCount', label: 'Rate', width: 160 },
  // { id: 'createdAt', label: 'Create at', width: 160 },
  // { id: 'inventoryType', label: 'Stock', width: 160 },
  // { id: 'publish', label: 'Publish', width: 110 },
];

const PUBLISH_OPTIONS = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
];

const defaultFilters = {
  name: '',
  // publish: [],
  // stock: [],
};

// ----------------------------------------------------------------------

export default function BusinessListView() {
  const router = useRouter();

  const table = useTable();

  const settings = useSettingsContext();

  const [tableData, setTableData] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);

  const [count, setCount] = useState(1)

  const [failedDeleteIds, setFailedDeleteIds] = useState([]);

  const { Business, meta, BusinessLoading, BusinessEmpty } = useGetBusiness(table.page + 1, table.rowsPerPage);

  const confirm = useBoolean();
  const errorDelete = useBoolean();


  useEffect(() => {
    if (Business.length) {
   
      console.log(Business);
      setTableData(Business);
      setCount(meta?.total)
      table.setPage(meta?.current_page - 1);
      table.setRowsPerPage(parseInt(meta?.per_page, 10));
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Business, meta?.cuurent_page, meta?.per_page, meta]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered;

  const denseHeight = table.dense ? 60 : 80;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || BusinessEmpty;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleDeleteRow = useCallback( async (id) => {
      const { deletedIds,  failedIds} = await deleteBusiness([id]);
      const deleteRows = tableData.filter((row) => !deletedIds.includes(row.id));
      setTableData(deleteRows);

      if(failedIds.length !== 0) {
        errorDelete.onTrue();
        setFailedDeleteIds(failedIds);
      }
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [errorDelete, dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback( async () => {
    if (table.selected.length === 0) return;

    const { deletedIds,  failedIds} = await deleteBusiness(table.selected);
    const deleteRows = tableData.filter((row) => !deletedIds.includes(row.id));
    setTableData(deleteRows);

    if(failedIds.length !== 0) {
      errorDelete.onTrue();
      setFailedDeleteIds(failedIds);
    }
    
    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [errorDelete, dataFiltered.length, dataInPage.length, table, tableData]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.Business.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.Business.details(id));
    },
    [router]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // const increaseQuantityBy50 = useCallback(async (id, qty) => {
  //   const requestBody = {qty: qty + 50}
  //   const {success, data} = await updateBusiness(id, requestBody);
  //   if(success){
  //     setTableData(prevTableData => {
  //       const index = prevTableData.findIndex(obj => obj.id === id);
  //       if(index !== -1){
  //         const updatedTableData = [...prevTableData];
  //         updatedTableData[index] = { ...updatedTableData[index], qty: data.qty };
  //         return updatedTableData;
  //       }else {
  //         return prevTableData
  //       } 
  //     });
  //   }
  // }, []);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            {
              name: 'Business',
              href: paths.dashboard.Business.root,
            },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.Business.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Store
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <BusinessTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            stockOptions={PRODUCT_STOCK_OPTIONS}
            publishOptions={PUBLISH_OPTIONS}
          />

          {canReset && (
            <BusinessTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {BusinessLoading ? (
                    [...Array(table.rowsPerPage)].map((i, index) => (
                      <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    ))
                  ) : (
                    <>
                      {dataFiltered
                        // .slice(
                        //   table.page * table.rowsPerPage,
                        //   table.page * table.rowsPerPage + table.rowsPerPage
                        // )
                        .map((row) => (
                          <BusinessTableRow
                            key={row.id}
                            row={row}
                            selected={table.selected.includes(row.id)}
                            onSelectRow={() => table.onSelectRow(row.id)}
                            onDeleteRow={() => handleDeleteRow(row.id)}
                            onEditRow={() => handleEditRow(row.id)}
                            onViewRow={() => handleViewRow(row.id)}
                            // onUpdateQty={() => increaseQuantityBy50(row.id, row.qty)}
                          />
                        ))}
                    </>
                  )}

                  {/* <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                  /> */}

                  <TableNoData notFound={notFound} />
                </TableBody>


              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={count}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
       <ConfirmDialog
        open={errorDelete.value}
        onClose={errorDelete.onFalse}
        title="Error Delete"
        content={
          <>
          {failedDeleteIds.map((errorItem) => (
            <Typography component='div' color='error' key={errorItem.BusinessId}>{errorItem.message}</Typography>
          ))}
        </>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  // const { name, stock, publish } = filters;
   const { name } = filters;


  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (Business) => Business.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  // if (stock.length) {
  //   inputData = inputData.filter((Business) => stock.includes(Business.inventoryType));
  // }

  // if (publish.length) {
  //   inputData = inputData.filter((Business) => publish.includes(Business.publish));
  // }

  return inputData;
}
