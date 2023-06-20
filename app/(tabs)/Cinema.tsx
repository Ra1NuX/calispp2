import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Carrousel from '../../components/Carrousel';

export default function Cinema() {
  const inset = useSafeAreaInsets()
  return (
    <View style={{paddingTop: inset.top}}>
      <Carrousel />
    </View>
  );
}
