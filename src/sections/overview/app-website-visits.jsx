import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import Chart, { useChart } from 'src/components/chart';

export default function AppWebsiteVisits({ title, subheader, chart, ...other }) {
  const { labels, series, options } = chart;

  const chartOptions = useChart({
    plotOptions: {
      bar: {
        horizontal: false, // Set to true if you want horizontal bars
        columnWidth: '30%', // Adjust the width of bars
        endingShape: 'rounded', // Specify bar ending shape (rounded, flat, etc.)
      },
    },
    fill: {
      type: 'solid', // Fill type for bars
    },
    dataLabels: {
      enabled: false, // Disable if you don't want data labels on bars
    },
    xaxis: {
      categories: labels, // Use labels as categories for x-axis
      title: {
        text: 'Chit Amount', // Set your x-axis label here
        style: {
          fontSize: '15px',
          fontWeight: 'bold',
          color: '#333',
        },
        offsetY: 5, // Adjust the vertical position of the x-axis label
      },
      labels: {
        style: {
          fontSize: '14px',
          colors: '#333',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Number of Customers',
        style: {
          fontSize: '15px',
          fontWeight: 'bold',
          color: '#333',
        },
        offsetX: -5, // Adjust the horizontal position of the y-axis label
      },
      labels: {
        style: {
          fontSize: '14px',
          colors: '#333',
        },
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => `${value.toFixed(0)}`,
      },
    },
    colors: ['#71a619'],
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />
      <Box sx={{ p: 3, pb: 1 }}>
        <Chart
          dir="ltr"
          type="bar"
          series={series}
          options={chartOptions}
          width="100%"
          height={365}
        />
      </Box>
    </Card>
  );
}

AppWebsiteVisits.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
