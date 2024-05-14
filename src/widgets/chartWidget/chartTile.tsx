import { Center, Text, createStyles } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import { IconChartBar } from '@tabler/icons-react';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { defineWidget } from '../helper';
import { IWidget } from '../widgets';

const definition = defineWidget({
  id: 'Chart',
  icon: IconChartBar,
  options: {
    chartTitle: {
      type: 'text',
      defaultValue: 'My Chart',
    },
    apiUrl: {
      type: 'text',
      defaultValue: '',
    },
    jsonParams: {
      type: 'text',
      defaultValue: '',
    },
    xAxisKey: {
      type: 'text',
      defaultValue: '',
    },
    yAxisKey: {
      type: 'text',
      defaultValue: '',
    },
    chartColor: {
      type: 'text',
      defaultValue: 'blue',
    },
    chartType: {
      type: 'select',
      defaultValue: '',
      data: [{ value: 'Bar Chart' }, { value: 'Pie Chart' }, { value: 'Line Chart' }],
    },
  },
  gridstack: {
    minWidth: 2,
    minHeight: 3,
    maxWidth: 12,
    maxHeight: 12,
  },
  component: ChartTile,
});

export type IChartWidget = IWidget<(typeof definition)['id'], typeof definition>;

interface ChartTileProps {
  widget: IChartWidget;
}

function ChartTile({ widget }: ChartTileProps) {
  const [data, setData] = useState([]);
  const { ref, width } = useElementSize();
  const { cx, classes } = useStyles();
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(widget.properties.apiUrl);
      const jsonData = await response.json();
      setData(jsonData.data ? jsonData.data : jsonData);
    };
    fetchData();
  }, []);

  const formatYAxisTick = (value: any) => {
    // Conditionally format large values
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`; // Convert to millions
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`; // Convert to thousands
    } else {
      return value; // Return value as is for smaller values
    }
  };
  const renderBarChart = () => (
    <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={widget.properties.xAxisKey} />
      <YAxis tickFormatter={formatYAxisTick} />
      <Legend />
      <Bar
        dataKey={widget.properties.yAxisKey}
        fill={widget.properties.chartColor}
        activeBar={<Rectangle fill="pink" stroke="blue" />}
      />
    </BarChart>
  );
  const renderLineChart = () => (
    <LineChart
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <XAxis dataKey={widget.properties.xAxisKey} />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line
        type="natural"
        dataKey={widget.properties.yAxisKey}
        stroke={widget.properties.chartColor}
        dot={false}
      />
    </LineChart>
  );

  const renderPieChart = () => (
    <PieChart>
      <Pie
        dataKey={widget.properties.yAxisKey}
        data={data}
        cx="50%"
        cy="50%"
        radius={80}
        fill={widget.properties.chartColor}
        label
      />
    </PieChart>
  );
  const renderError = () => (
    <Center>
      <Text>{t('error')}</Text>
    </Center>
  );

  return (
    <>
      <Text size={width < 200 ? 'sm' : 'lg'} className={cx(classes.title, 'dashboard-tile-title')}>
        {widget.properties.chartTitle}
      </Text>
      <ResponsiveContainer width="100%" height="100%">
        {widget.properties.chartType === 'Line Chart'
          ? renderLineChart()
          : widget.properties.chartType === 'Bar Chart'
            ? renderBarChart()
            : widget.properties.chartType === 'Pie Chart'
              ? renderPieChart()
              : renderError()}
      </ResponsiveContainer>
    </>
  );
}

const useStyles = createStyles(() => ({
  title: {
    lineHeight: '1',
    whiteSpace: 'nowrap',
    fontWeight: 700,
    fontSize: '1.5rem',
    paddingBottom: 30,
  },
}));
export default definition;
