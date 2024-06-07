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
      <TableCell>{item.member_name}</TableCell>
      <TableCell>{item.memberid}</TableCell>
      <TableCell>{item.auctiondate != null && item.auctiondate !== "" ? dayjs(item.auctiondate).format('DD-MM-YYYY') : ""}</TableCell>
      <TableCell>{item.tktno}</TableCell>
      <TableCell>{item.installno}</TableCell>
    </TableRow>
  );
}

ChitPaymentMemberTableRow.propTypes = {
  key: PropTypes.any,
  selected: PropTypes.any,
  handleClick: PropTypes.func,
  item: PropTypes.object
};
