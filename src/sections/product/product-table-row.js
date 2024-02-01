import PropTypes from 'prop-types';
// import { format } from 'date-fns';
// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// import LinearProgress from '@mui/material/LinearProgress';
// utils
import { fCurrency } from 'src/utils/format-number';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function ProductTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  onUpdateQty
}) {
  const {
    name,
    price,
    price_before_discount,
    // publish,
    image,
    categories,
    // quantity,
    // createdAt,
    // available,
    // inventoryType,
    currencies_symbole,
    status,
    no_of_orders,
    qty
  } = row;
  console.log(row);


  const confirm = useBoolean();

  const popover = usePopover();
  
const categoryNames = categories.map(cat => cat.name).join(', ');
  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            alt={name}
            src={image}
            variant="rounded"
            sx={{ width: 64, height: 64, mr: 2 }}
          />

          <ListItemText
            disableTypography
            primary={
              <Link
                color="inherit"
                variant="subtitle2"
                onClick={onViewRow}
                sx={{ cursor: 'pointer' }}
              >
                {name}
              </Link>
            }
            secondary={
              <Box component="div" sx={{ typography: 'body2', color: 'text.disabled' }}>
                {categoryNames}
              </Box>
            }
          />
        </TableCell>

         <TableCell>
          <Label variant="soft" color={(status === 'approved' && 'info') || 'default'}>
            {status}
          </Label>
        </TableCell>

        <TableCell>{qty}
        <Button 
          variant='contained' 
          size='small' 
          sx={{ fontSize: '24px', ml:2}} 
          onClick={onUpdateQty}
        >
          +<span style={{fontSize:'12px'}} >50</span>
        </Button>
        </TableCell>

        <TableCell>{fCurrency(price, currencies_symbole)}</TableCell>
        <TableCell>{fCurrency(price_before_discount, currencies_symbole)}</TableCell>
        <TableCell>{no_of_orders}</TableCell>




        {/* <TableCell>
          <ListItemText
            primary={format(new Date(createdAt), 'dd MMM yyyy')}
            secondary={format(new Date(createdAt), 'p')}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell> */}
{/* 
         <TableCell sx={{ typography: 'caption', color: 'text.secondary' }}>
          <LinearProgress
            value={(available * 100) / quantity}
            variant="determinate"
            color={
              (inventoryType === 'out of stock' && 'error') ||
              (inventoryType === 'low stock' && 'warning') ||
              'success'
            }
            sx={{ mb: 1, height: 6, maxWidth: 80 }}
          />
          {!!available && available} {inventoryType}
        </TableCell> */}


        {/* <TableCell>
          <Label variant="soft" color={(publish === 'published' && 'info') || 'default'}>
            {publish}
          </Label>
        </TableCell> */}

        <TableCell align="right">
          <IconButton color={popover.open ? 'primary' : 'default'} onClick={popover.onOpen}>
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
          sx={{ color: 'error.main' }}
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
          <Button variant="contained" color="error" onClick={() => {
            confirm.onFalse();
            onDeleteRow();
            }}>
            Delete
          </Button>
        }
      />
    </>
  );
}

ProductTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
