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
    <TableRow className='chit-receipt-popup-row_table_box' hover tabIndex={-1} role="checkbox" selected={selected} onClick={handleClick} sx={{ cursor: 'pointer' }}>
      <TableCell padding="checkbox" style={{ display: 'none' }}>
        <Checkbox disableRipple checked={selected} onChange={handleClick} />
      </TableCell>
      <TableCell data-label="Member Name" className='chit-receipt-popup-membername-cell'>{item.name}</TableCell>
      <TableCell data-label="Member Id" className='chit-receipt-popup-memnerid-cell'>{item.member_id}</TableCell>
      <TableCell data-label="Tkt. No" className='chit-receipt-popup-tktno-cell'>{ item.tktNo}</TableCell>
      <TableCell data-label="F.Code" className='chit-receipt-popup-fcode-cell'>{item.fcno}</TableCell>
      <TableCell data-label="Phone" className='chit-receipt-popup-phone-cell'>{ item.sms_phoneno }</TableCell>
      <TableCell className='tick-pending'>
        {keyvalue === "paidmember"
          ? <Avatar alt='Loading' className='paidmember-icon' src='/assets/images/img/green_tick.png' sx={{ width: 20, height: 20 }} />
          : <Avatar alt='Loading' className='paidmember-icon' src='/assets/images/img/pending.png' sx={{ width: 20, height: 20 }} />}
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
