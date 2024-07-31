import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import Timeline from '@mui/lab/Timeline';
import { Stack, Button } from '@mui/material';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';

import { fDateTime1 } from 'src/utils/format-time';

export default function AnalyticsOrderTimeline({ title, subheader, list, ...other }) {

  const navigate = useNavigate();

  return (
    <Card {...other} sx={{ height: 470 }}>
      <CardHeader title={title} subheader={subheader} />

      <Timeline
        sx={{
          m: 0,
          p: 3,
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0,
          },
        }}
      >
        {list.map((item, index) => (
          <OrderItem key={item.id} item={item} lastTimeline={index === list.length - 1} />
        ))}
      </Timeline>
      <Stack alignItems="center" justifyContent="center">
        <Button className="custom-button" sx={{ height: 40, width: 120, }} variant="contained" onClick={() => navigate('/ActivityLog/list')}>
          View All
        </Button>
      </Stack>
    </Card>
  );
}

AnalyticsOrderTimeline.propTypes = {
  list: PropTypes.array,
  subheader: PropTypes.string,
  title: PropTypes.string,
};

// ----------------------------------------------------------------------

function OrderItem({ item, lastTimeline }) {
  const { type, description, created_on } = item;

  const getOperationColor = (types) => {
    switch (types) {
      case 'Save':
        return '#4caf50';
      case 'Updates':
        return '#ff9800';
      case 'Delete':
        return '#f44336';
      case 'ACTIVATE':
        return '#2196f3';
      default:
        return '#d32f2f';
    }
  };

  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot sx={{  backgroundColor: getOperationColor(type), }} />
        {lastTimeline ? null : <TimelineConnector />}
      </TimelineSeparator>

      <TimelineContent>
        <Typography variant="subtitle2" >{fDateTime1(created_on)}</Typography>
        <Typography variant="caption" sx={{ color: 'text.disabled' }}>{description !== null && description !== "" && description !== undefined ? description : '--'}</Typography>
      </TimelineContent>
    </TimelineItem>
  );
}

OrderItem.propTypes = {
  item: PropTypes.object,
  lastTimeline: PropTypes.bool,
};
