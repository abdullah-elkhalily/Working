import PropTypes from "prop-types";
import {
  Box,
  Link,
  Button,
  Avatar,
  MenuItem,
  TableRow,
  Checkbox,
  TableCell,
  IconButton,
  ListItemText,
} from "@mui/material";
import Label from "src/components/label";
import Iconify from "src/components/iconify";
import { ConfirmDialog } from "src/components/custom-dialog";
import CustomPopover, { usePopover } from "src/components/custom-popover";

import { useBoolean } from "src/hooks/use-boolean";

export default function BusinessTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  onUpdateQty,
}) {
  const {
    name,
    country,
    no_of_orders, 
    mobile_number,
    

    image,
   

    status,

    address,
  } = row;

  const confirm = useBoolean();
  const popover = usePopover();

  // Check if categories is defined before using map


  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ display: "flex", alignItems: "center",width:200 }}>
          <Avatar
            alt={name}
            src={image}
            variant="rounded"
            sx={{ width: 60, height: 64, mr: 2 }}
          />
          <ListItemText
            disableTypography
            primary={
              <Link
                color="inherit"
                variant="subtitle2"
                onClick={onViewRow}
                sx={{ cursor: "pointer",   width:90 }}
              >
                {name}
              </Link>
            }
          
          />
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={(status === "approved" && "info") || "default"}
          >
            {status}
          </Label>
        </TableCell>

        <TableCell>{address}</TableCell>
        <TableCell>{country}</TableCell>

        <TableCell>{mobile_number}</TableCell>

        <TableCell>{no_of_orders}</TableCell>

        <TableCell align="right">
          <IconButton
            color={popover.open ? "primary" : "default"}
            onClick={popover.onOpen}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: "error.main" }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              confirm.onFalse();
              onDeleteRow();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

BusinessTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
