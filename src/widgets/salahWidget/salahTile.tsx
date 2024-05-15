import { Center, Group, Skeleton, Stack, Text, createStyles } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import { IconAlarm } from '@tabler/icons-react';
import { t } from 'i18next';
import { api } from '~/utils/api';

import { defineWidget } from '../helper';
import { IWidget } from '../widgets';

const definition = defineWidget({
  id: 'Salah',
  icon: IconAlarm,
  options: {
    customTitle: {
      type: 'text',
      defaultValue: 'Salah',
    },
    location: {
      type: 'location',
      defaultValue: {
        latitude: 48.85341,
        longitude: 2.3488,
      },
    },
    // api_url: {
    //   type: 'text',
    //   defaultValue: '',
    // },
  },
  gridstack: {
    minWidth: 1,
    minHeight: 1,
    maxWidth: 2,
    maxHeight: 4,
  },
  component: salahTile,
});

export type ISalahWidget = IWidget<(typeof definition)['id'], typeof definition>;

interface SalahTileProps {
  widget: ISalahWidget;
}

function salahTile({ widget }: SalahTileProps) {
  const {
    data: salah,
    isLoading,
    isError,
  } = api.salah.retrievePrayer.useQuery(widget.properties.location);
  const { ref, width } = useElementSize();
  const { cx, classes } = useStyles();

  if (isLoading) {
    return (
      <Stack
        ref={ref}
        spacing="xs"
        justify="space-around"
        align="center"
        style={{ height: '100%', width: '100%' }}
      >
        <Skeleton height={40} width={100} mb="xl" />
        <Group noWrap>
          <Skeleton height={50} circle />
          <Group>
            <Skeleton height={25} width={70} mr="lg" />
            <Skeleton height={25} width={70} />
          </Group>
        </Group>
      </Stack>
    );
  }
  if (isError) {
    return (
      <Center>
        <Text weight={500}>{t('error')}</Text>
      </Center>
    );
  }
  return (
    <Stack ref={ref} className={cx(classes.wrapper, 'dashboard-tile-prayer-wrapper')}>
      <Text
        size={width < 200 ? 'sm' : 'lg'}
        className={cx(classes.title, 'dashboard-tile-prayer-title')}
      >
        {widget.properties.customTitle}
      </Text>
      <span style={{ display: 'flex', padding: 20, width: '100%' }}>
        <Text
          size={width < 200 ? 'sm' : 'lg'}
          className={cx(classes.prayerName, 'dashboard-tile-prayerName')}
        >
          Fajr
        </Text>
        <Text
          size={width < 200 ? 'sm' : 'lg'}
          className={cx(classes.prayer, 'dashboard-tile-prayer')}
        >
          {salah.timings.Fajr}
        </Text>
      </span>
      <span style={{ display: 'flex', padding: 20, width: '100%' }}>
        <Text
          size={width < 200 ? 'sm' : 'lg'}
          className={cx(classes.prayerName, 'dashboard-tile-prayerName')}
        >
          Sunrise
        </Text>
        <Text
          size={width < 200 ? 'sm' : 'lg'}
          className={cx(classes.prayer, 'dashboard-tile-prayer')}
        >
          {salah.timings.Sunrise}
        </Text>
      </span>
      <span style={{ display: 'flex', padding: 20, width: '100%' }}>
        <Text
          size={width < 200 ? 'sm' : 'lg'}
          className={cx(classes.prayerName, 'dashboard-tile-prayerName')}
        >
          Dhuhr
        </Text>
        <Text
          size={width < 200 ? 'sm' : 'lg'}
          className={cx(classes.prayer, 'dashboard-tile-prayer')}
        >
          {salah.timings.Dhuhr}
        </Text>
      </span>
      <span style={{ display: 'flex', padding: 20, width: '100%' }}>
        <Text
          size={width < 200 ? 'sm' : 'lg'}
          className={cx(classes.prayerName, 'dashboard-tile-prayerName')}
        >
          Asr
        </Text>
        <Text
          size={width < 200 ? 'sm' : 'lg'}
          className={cx(classes.prayer, 'dashboard-tile-prayer')}
        >
          {salah.timings.Asr}
        </Text>
      </span>
      <span style={{ display: 'flex', padding: 20, width: '100%' }}>
        <Text
          size={width < 200 ? 'sm' : 'lg'}
          className={cx(classes.prayerName, 'dashboard-tile-prayerName')}
        >
          Maghrib
        </Text>
        <Text
          size={width < 200 ? 'sm' : 'lg'}
          className={cx(classes.prayer, 'dashboard-tile-prayer')}
        >
          {salah.timings.Maghrib}
        </Text>
      </span>
      <span style={{ display: 'flex', padding: 20, width: '100%' }}>
        <Text
          size={width < 200 ? 'sm' : 'lg'}
          className={cx(classes.prayerName, 'dashboard-tile-prayerName')}
        >
          Isha
        </Text>
        <Text
          size={width < 200 ? 'sm' : 'lg'}
          className={cx(classes.prayer, 'dashboard-tile-prayer')}
        >
          {salah.timings.Isha}
        </Text>
      </span>
    </Stack>
  );
}

const useStyles = createStyles(() => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    gap: 0,
  },
  title: {
    lineHeight: '1',
    whiteSpace: 'nowrap',
    fontWeight: 700,
    fontSize: '1.5rem',
    paddingBottom: 30,
  },
  prayerName: {
    lineHeight: '1',
    whiteSpace: 'nowrap',
    fontSize: '1.25rem',
    flexGrow: 1,
  },
  prayer: {
    lineHeight: '1',
    whiteSpace: 'nowrap',
    fontSize: '1.25rem',
  },
}));

export default definition;
