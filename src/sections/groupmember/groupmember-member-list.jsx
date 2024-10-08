import PropTypes from 'prop-types';

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
    <TableRow hover tabIndex={-1} role="checkbox" selected={selected} onClick={handleClick} sx={{ cursor: 'pointer',  }}>
      <TableCell padding="checkbox" style={{ display: 'none' }}>
        <Checkbox disableRipple checked={selected} onChange={handleClick} />
      </TableCell>
      <TableCell component="th" scope="row" >{item.name}</TableCell>
      <TableCell>{item.id}</TableCell>
      <TableCell>{item.mapped_phone}</TableCell>
    </TableRow>
  );
}

GroupMemberTableRow.propTypes = {
  key: PropTypes.any,
  selected: PropTypes.any,
  handleClick: PropTypes.func,
  item: PropTypes.object
};
