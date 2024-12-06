import { Text, View } from 'react-native';

import { EditScreenInfo } from './EditScreenInfo';
import { useStore } from '~/store/store';
import { Button } from './Button';
import { router } from 'expo-router';

type ScreenContentProps = {
  title: string;
  path: string;
  children?: React.ReactNode;
};

export const ScreenContent = ({ title, path, children }: ScreenContentProps) => {
  const { bears, increasePopulation } = useStore()
  return (
    <View className={styles.container}>
      <Text>Total Bears {bears}</Text>
      <Button title='Increase' onPress={increasePopulation} />

      <Text className={styles.title}>{title}</Text>
      <Button title='Body' onPress={() => router.push(`/body`)} />
      <View className={styles.separator} />
      <EditScreenInfo path={path} />
      {children}
    </View>
  );
};
const styles = {
  container: `items-center flex-1 justify-center`,
  separator: `h-[1px] my-7 w-4/5 bg-gray-200`,
  title: `text-xl font-bold`,
};
