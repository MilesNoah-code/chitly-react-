import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import { Stack, Avatar, Typography } from '@mui/material';

import Label from 'src/components/label';

export default function GroupMemberTableRow({
  key,
  selected,
  handleClick,
  item,
}) {

  const ImageUrl = JSON.parse(localStorage.getItem('imageUrl'));

  return (
    <TableRow hover tabIndex={-1} role="checkbox" selected={selected} onClick={handleClick} sx={{ cursor: 'pointer' }}>
      <TableCell padding="checkbox" style={{ display: 'none' }}>
        <Checkbox disableRipple checked={selected} onChange={handleClick} />
      </TableCell>
      <TableCell component="th" scope="row" >
        <Stack direction="row" alignItems="center" spacing={2} marginLeft={2}>
          <Avatar alt={item.name} src={`${ImageUrl.STORAGE_NAME}${ImageUrl.BUCKET_NAME}/${item.mapped_photo}`} >{item.name[0]}</Avatar>
          <Typography variant="subtitle2" noWrap>
            {item.name}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell>{item.accno}</TableCell>
      <TableCell>{item.mapped_phone}</TableCell>
      <TableCell>
        <Label color={(item.status === 'banned' && 'error') || 'success'}>{item.status}</Label>
      </TableCell>
    </TableRow>
  );
}

GroupMemberTableRow.propTypes = {
  key: PropTypes.any,
  selected: PropTypes.any,
  handleClick: PropTypes.func,
  item: PropTypes.object
};
