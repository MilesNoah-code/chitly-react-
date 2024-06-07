import PropTypes from 'prop-types';

import { Avatar } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';

export default function ChitReceiptMemberTableRow({
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
      <TableCell>{item.sms_phoneno}</TableCell>
      <TableCell>{item.fcno}</TableCell>
      <TableCell>
        {key === "paidmember"
          ? <Avatar alt='../../../public/assets/icons/green_tick.png' src='../../../public/assets/icons/green_tick.png' sx={{ width: 20, height: 20 }} />
          : <Avatar alt='../../../public/assets/icons/pending.png' src='../../../public/assets/icons/pending.png' sx={{ width: 20, height: 20 }} />}
      </TableCell>
    
    </TableRow>
  );
}

ChitReceiptMemberTableRow.propTypes = {
  key: PropTypes.any,
  selected: PropTypes.any,
  handleClick: PropTypes.func,
  item: PropTypes.object
};
