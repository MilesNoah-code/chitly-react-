import dayjs from 'dayjs';
import PropTypes from 'prop-types';

import { Button } from '@mui/material';
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
    <TableRow className='chitpayment-popup-row' hover tabIndex={-1} role="checkbox" selected={selected} onClick={handleClick} sx={{ cursor: 'pointer' }}>
      <TableCell padding="checkbox" style={{ display: 'none' }}>
        <Checkbox disableRipple checked={selected} onChange={handleClick} />
      </TableCell>
      <TableCell data-label="Group No" className='chitpayment-popup-groupno-cell'>{item.groupno}</TableCell>
      <TableCell data-label="Member Name" className='chitpayment-popup-membername-cell'>{item.member_name}</TableCell>
      <TableCell data-label="Member Id" className='chitpayment-popup-memberid-cell'>{item.memberid}</TableCell>
      <TableCell data-label="Auction Date" className='chitpayment-popup-auctiondate-cell'>{item.auctiondate != null && item.auctiondate !== "" ? dayjs(item.auctiondate).format('DD-MM-YYYY') : ""}</TableCell>
      <TableCell data-label="Ticket. No" className='chitpayment-popup-tktno-cell'>{item.tktno}</TableCell>
      <TableCell data-label="Install. No" className='chitpayment-popup-installno-cell'>{item.installno}</TableCell>
      <TableCell className="chitpayment-add-button-cell"> <Button className="chitpayment-add-button-cell-text" variant="contained" >Add</Button> </TableCell>
    </TableRow>
  );
}

ChitPaymentMemberTableRow.propTypes = {
  key: PropTypes.any,
  selected: PropTypes.any,
  handleClick: PropTypes.func,
  item: PropTypes.object
};
