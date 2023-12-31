import React, { useEffect, useState } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';
import formatDistance from 'date-fns/formatDistance';
import { Locale } from 'date-fns';

interface Props {
  dateTo: Date;
  updateInterval?: number;
  dateFrom?: Date;
  hideAgo?: boolean;
  locale?: Locale;
  style?: StyleProp<TextStyle>;
}

const TimeAgo: React.FC<Props> = ({
  dateTo,
  dateFrom,
  updateInterval = 60000,
  hideAgo = false,
  locale,
  style,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      if (!dateFrom) setCurrentDate(new Date());
    }, updateInterval);
    return () => clearInterval(interval);
  }, [dateFrom, updateInterval]);

  return (
    <Text {...{ style }}>
      {formatDistance(dateTo, dateFrom || currentDate, {
        addSuffix: !hideAgo,
        locale: locale
      })}
    </Text>
  );
};

export default TimeAgo;