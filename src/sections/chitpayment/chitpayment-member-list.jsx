import dayjs from 'dayjs';
import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';

export default function ChitPaymentMemberTableRow({
  key,
  selected,
  handleClick,
  item,
}) {

  return (
    <TableRow hover tabIndex={-1} role="checkbox" selected={selected} onClick={handleClick} sx={{ cursor: 'pointer' }}>
      <TableCell padding="checkbox" style={{ display: 'none' }}>
        <Checkbox disableRipple checked={selected} onChange={handleClick} />
      </TableCell>
      <TableCell>{item.groupno}</TableCell>
      <TableCell>{item.tktNo}</TableCell>
      <TableCell>{item.name}</TableCell>
      <TableCell>{item.date != null && item.date !== "" ? dayjs(item.date).format('DD-MM-YYYY') : ""}</TableCell>
      <TableCell>{item.fcno}</TableCell>
      <TableCell>{item.fcno}</TableCell>
      <TableCell>{ }</TableCell>
    </TableRow>
  );
}

ChitPaymentMemberTableRow.propTypes = {
  key: PropTypes.any,
  selected: PropTypes.any,
  handleClick: PropTypes.func,
  item: PropTypes.object
};
