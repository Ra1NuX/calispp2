import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { FlatList, Text, View, TouchableHighlight } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { Cali } from "../../../components/Cali";
import { CalisContext } from "../../../contexts/CalisContext";
import { useFetchCalis } from "../../../hooks/useFetchCalis";
import { getCalis } from "../../../utils";

export default function Whiteboard() {
  console.log('render');
  const [loading] = useFetchCalis();
  const [refreshing, setRefresing] = useState(false);
  const { calis, setCalis } = useContext(CalisContext)!;
  const [isAtTop, setIsAtTop] = useState<boolean>(true);
  const [disabled, setDisabled] = useState(false)
  const Router = useRouter()
  const navigation = useNavigation();

  const size = useSharedValue(isAtTop ? 1 : 0);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{
                scale: size.value
            }],
        };
    });

  useEffect(() => {
    if(isAtTop) {
      setDisabled(false);
      navigation.setOptions({ tabBarVisible: true })
      setTimeout(() => {
        size.value = withSpring(1)
      }, 200)
    } else {
      size.value = withTiming(0, {
        duration: 200
      }); 
      navigation.setOptions({ tabBarVisible: false })
      setTimeout(() => setDisabled(true), 200)
    }
    
  }, [isAtTop])
  

  const handleRefresh = async () => {
    setRefresing(true)
    await AsyncStorage.removeItem('calis');
    const newCalis = await getCalis();
    setCalis(newCalis)
    setRefresing(false)
  }



  return (
    loading 
    ? <Text>Loading</Text> : 
    <View className="h-full">
      <FlatList 
        onScroll={({nativeEvent}) => {
          if (nativeEvent.contentOffset.y === 0) {
            if (!isAtTop) setIsAtTop(true);
          } else {
            if (isAtTop) setIsAtTop(false);
          }
        }}
        ItemSeparatorComponent={() => <View className="w-full h-4"/>}
        scrollEventThrottle={10}
        contentContainerStyle={{padding: 16}}
        refreshing={refreshing} 
        onRefresh={handleRefresh} 
        data={calis} 
        renderItem={({ item }) => <Cali {...item} />} 
      />
      <Animated.View style={[animatedStyle]} className={`${disabled ? 'hidden' : ''} h-14 aspect-square overflow-hidden rounded-2xl m-4 absolute right-0 bottom-0 shadow-lg shadow-black`}>
        <TouchableHighlight onPress={() => Router.push('/modal')}>
            <View className="h-14 aspect-square flex items-center justify-center color rounded-2xl bg-color-light">
              <Ionicons name={"add"} size={30} color="#fff" />
            </View>
        </TouchableHighlight>
      </Animated.View>
    </View>
  );
}

