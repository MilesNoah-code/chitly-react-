import PropTypes from 'prop-types';

import { Avatar } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';

export default function ChitReceiptMemberTableRow({
  keyvalue,
  selected,
  handleClick,
  item,
}) {

  return (
    <TableRow hover tabIndex={-1} role="checkbox" selected={selected} onClick={handleClick} sx={{ cursor: 'pointer' }}>
      <TableCell padding="checkbox" style={{ display: 'none' }}>
        <Checkbox disableRipple checked={selected} onChange={handleClick} />
      </TableCell>
      <TableCell>{item.name}</TableCell>
      <TableCell>{item.member_id}</TableCell>
      <TableCell>{ item.tktNo}</TableCell>
      <TableCell>{item.fcno}</TableCell>
      <TableCell>{ item.sms_phoneno }</TableCell>
      <TableCell>
        {keyvalue === "paidmember"
          ? <Avatar alt='Loading' src='/assets/images/img/green_tick.png' sx={{ width: 20, height: 20 }} />
          : <Avatar alt='Loading' src='/assets/images/img/pending.png' sx={{ width: 20, height: 20 }} />}
      </TableCell>
    
    </TableRow>
  );
}

ChitReceiptMemberTableRow.propTypes = {
  keyvalue: PropTypes.any,
  selected: PropTypes.any,
  handleClick: PropTypes.func,
  item: PropTypes.object
};
