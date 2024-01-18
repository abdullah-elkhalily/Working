import { useState, useCallback } from "react";
// @mui
import { alpha } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Container from "@mui/material/Container";
import TableBody from "@mui/material/TableBody";
import IconButton from "@mui/material/IconButton";
import TableContainer from "@mui/material/TableContainer";
// routes
import { paths } from "src/routes/paths";
// import { useRouter } from "src/routes/hooks";

// utils
import { fTimestamp } from "src/utils/format-time";
// hooks
import { useBoolean } from "src/hooks/use-boolean";
// components
import Label from "src/components/label";
import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";
import { ConfirmDialog } from "src/components/custom-dialog";
import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import {
  useTable,
  getComparator,
  TableNoData,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
  TableSkeleton,
} from "src/components/table";
//
import OrderTableRow from "../order-table-row";
import OrderTableToolbar from "../order-table-toolbar";
import OrderTableFiltersResult from "../order-table-filters-result";

// api
import { useGetAllOrders } from "src/api/delivery";

// ----------------------------------------------------------------------

export const DELIVERY_ORDER_STATUS_OPTIONS = [
  { value: 'Delivered done', label: 'Delivered done' },
  { value: 'On demand', label: 'On demand' },
  { value: 'canceled', label: 'Cancelled' },
  { value: 'processing', label: 'processing' },
  { value: 'Ready orders', label: 'Ready orders' },
];

export const DELIVERY_STATUS_OPTIONS = {
  DONE: "Delivered done",
  ON_DEMAND: "On demand",
  CANCELED: "canceled",
  PROCESSING: "processing",
  READY: "Ready orders",
};

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  ...DELIVERY_ORDER_STATUS_OPTIONS,
];

const TABLE_HEAD = [
  { id: "order_no", label: "Order", width: 116 },
  { id: "name", label: "Customer" },
  { id: "order_date", label: "Date", width: 140 },
  { id: "qty", label: "Items", width: 120, align: "center" },
  { id: "total_price", label: "Price", width: 140 },
  { id: "status", label: "Status", width: 110 },
  { id: "", width: 88 },
];

const defaultFilters = {
  name: "",
  status: "all",
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function OrderListView() {
  const table = useTable({ defaultOrderBy: "orderNumber" });

  const settings = useSettingsContext();

  // const router = useRouter();

  const confirm = useBoolean();

  const { allOrders, ordersLoading } = useGetAllOrders();
  // console.log(allOrders, ordersLoading)
  const [tableData, setTableData] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: allOrders,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;

  const canReset =
    !!filters.name ||
    filters.status !== "all" ||
    (!!filters.startDate && !!filters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => {
        return {
          ...prevState,
          [name]: value,
        };
      });
    },
    [table]
  );

  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter(
      (row) => !table.selected.includes(row.id)
    );
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleViewRow = useCallback((_id) => {
    // router.push(paths.dashboard.order.details(id));
    return;
  }, []);

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters("status", newValue);
    },
    [handleFilters]
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            {
              name: "Dashboard",
              href: paths.dashboard.root,
            },
            {
              name: "Delivery",
              href: paths.dashboard.delivery.root,
            },
            { name: "List" },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) =>
                `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === "all" || tab.value === filters.status) &&
                        "filled") ||
                      "soft"
                    }
                    color={
                      (tab.value === DELIVERY_STATUS_OPTIONS.DONE &&
                        "success") ||
                      (tab.value === DELIVERY_STATUS_OPTIONS.ON_DEMAND &&
                        "warning") ||
                      (tab.value === DELIVERY_STATUS_OPTIONS.CANCELED &&
                        "error") ||
                      (tab.value === DELIVERY_STATUS_OPTIONS.PROCESSING &&
                        "secondary") ||
                      (tab.value === DELIVERY_STATUS_OPTIONS.READY && "info") ||
                      "default"
                    }
                  >
                    {tab.value === "all" && allOrders.length}
                    {tab.value === DELIVERY_STATUS_OPTIONS.DONE &&
                      allOrders.filter(
                        (order) =>
                          order.orders_status.name ===
                          DELIVERY_STATUS_OPTIONS.DONE
                      ).length}

                    {tab.value === DELIVERY_STATUS_OPTIONS.ON_DEMAND &&
                      allOrders.filter(
                        (order) =>
                          order.orders_status.name ===
                          DELIVERY_STATUS_OPTIONS.ON_DEMAND
                      ).length}
                    {tab.value === DELIVERY_STATUS_OPTIONS.CANCELED &&
                      allOrders.filter(
                        (order) =>
                          order.orders_status.name ===
                          DELIVERY_STATUS_OPTIONS.CANCELED
                      ).length}
                    {tab.value === DELIVERY_STATUS_OPTIONS.PROCESSING &&
                      allOrders.filter(
                        (order) => order.orders_status.name === DELIVERY_STATUS_OPTIONS.PROCESSING
                      ).length}
                    {tab.value === DELIVERY_STATUS_OPTIONS.READY &&
                      allOrders.filter(
                        (order) => order.orders_status.name === DELIVERY_STATUS_OPTIONS.READY
                      ).length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <OrderTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            canReset={canReset}
            onResetFilters={handleResetFilters}
          />

          {canReset && (
            <OrderTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: "relative", overflow: "unset" }}>
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
              <Table
                size={table.dense ? "small" : "medium"}
                sx={{ minWidth: 960 }}
              >
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
                      allOrders.map((row) => row.id)
                    )
                  }
                />
                {ordersLoading ? (
                  [...Array(table.rowsPerPage)].map((i, index) => (
                    <TableSkeleton key={index} sx={{ height: denseHeight }} />
                  ))
                ) : (
                  <TableBody>
                    {dataFiltered
                      .slice(
                        table.page * table.rowsPerPage,
                        table.page * table.rowsPerPage + table.rowsPerPage
                      )
                      .map((row) => (
                        <OrderTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(row.id)}
                          onSelectRow={() => table.onSelectRow(row.id)}
                          onDeleteRow={() => handleDeleteRow(row.id)}
                          onViewRow={() => handleViewRow(row.id)}
                        />
                      ))}
                    <TableNoData notFound={notFound} />
                  </TableBody>
                )}
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
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
            Are you sure want to delete{" "}
            <strong> {table.selected.length} </strong> items?
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
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { status, name, startDate, endDate } = filters;
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (order) =>
        order.order_no.indexOf(name.toLowerCase()) !== -1 ||
        order.user.full_name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }
  if (status !== "all") {
    inputData = inputData.filter(
      (order) => order.orders_status.name === status
    );
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter(
        (order) =>
          fTimestamp(order.createdAt) >= fTimestamp(startDate) &&
          fTimestamp(order.createdAt) <= fTimestamp(endDate)
      );
    }
  }

  return inputData;
}
