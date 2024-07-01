import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';

export default function GroupMemberTableRow({
  key,
  selected,
  handleClick,
  item,
}) {

  const navigate = useNavigate();

  const HandleSelectEdit = () => {
    navigate(`/groupMember`, {
      state: {
        screen: 'edit',
        data: item,
      },
    });
  };

  const formatNumber = (number) => new Intl.NumberFormat('en-IN').format(number);

  return (
    <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
      <TableCell padding="checkbox" style={{ display: 'none' }}>
        <Checkbox disableRipple checked={selected} onChange={handleClick} />
      </TableCell>
      <TableCell sx={{ ml: 2 }}>{item.id}</TableCell>
      <TableCell component="th" scope="row" >
        <Stack direction="row" alignItems="center" >
          <Typography variant="subtitle2" noWrap>
            {item.groupno}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell>{item.duration}</TableCell>
      <TableCell>{item.auction_mode}</TableCell>
      <TableCell>{item.amount != null && item.amount !== "" ? formatNumber(Math.round(item.amount)) : ""}</TableCell>
      <TableCell align="right">
        <IconButton onClick={HandleSelectEdit} sx={{ cursor: 'pointer' }}>
          <Iconify icon="eva:edit-fill" />
        </IconButton>
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