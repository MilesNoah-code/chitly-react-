import PropTypes from 'prop-types';

import Button from '@mui/material/Button'
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';


export default function GroupMemberTableRow({
  key,
  selected,
  handleClick,
  item,
}) {

  // const ImageUrl = JSON.parse(localStorage.getItem('imageUrl'));

  return (

    <TableRow  className='row_table_box' hover tabIndex={-1} role="checkbox" selected={selected} onClick={window.innerWidth >= 768 ? handleClick() : undefined}  sx={{ cursor: 'pointer',  }}>

      <TableCell padding="checkbox" style={{ display: 'none' }}>
        <Checkbox disableRipple checked={selected} onChange={handleClickItem} />
      </TableCell>

      <TableCell component="th" scope="row" data-label="Name" className='member-name-cell'>{item.name}</TableCell>
      <TableCell data-label="Mobile Number" className='member-mobile-cell'>{item.mapped_phone}</TableCell>
      <TableCell data-label="Acc No" className='member-acc-cell'>{item.id}</TableCell>
      <TableCell className="member-add-button-cell"> <Button className="member-add-button-cell-text" variant="contained" onClick={window.innerWidth < 768 ? handleClick() : undefined}>Add</Button> </TableCell>
      

    </TableRow>
  );
}

GroupMemberTableRow.propTypes = {
  key: PropTypes.any,
  selected: PropTypes.any,
  handleClick: PropTypes.func,
  item: PropTypes.object
};
