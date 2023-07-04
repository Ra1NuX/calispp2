import { Tabs } from 'expo-router';
import TabBar from '../../components/TabBar';
import { Ionicons } from "@expo/vector-icons";
import ProfilePic from '../../components/ProfilePic';
import {View} from 'react-native'


export default function TabLayout() {

  return (
    <Tabs
      screenOptions={
        {
          headerStyle: {backgroundColor: "#F2C846"},
          headerLeft: (props) => <View className='ml-3'>
              <ProfilePic />
            </View>
        }
      }
      tabBar={(props) => <TabBar {...props} /> }
      >
       <Tabs.Screen
          name="Calis"
          options={{
            tabBarHideOnKeyboard: true,
            tabBarLabel: 'Calis',
            title:'',
            tabBarIcon: ({color, size}) => <Ionicons name='ios-flower-sharp' size={size} color={color}/>,
          }}
        />
      <Tabs.Screen  
        name="Cinema"
        options={{
          tabBarIcon: ({color, size}) => <Ionicons name='play' size={size} color={color}/>,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
