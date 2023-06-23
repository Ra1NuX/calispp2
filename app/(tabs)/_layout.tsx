import { Tabs } from 'expo-router';
import TabBar from '../../components/TabBar';
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { Text, View } from 'react-native';
import Header from '../../components/Header';


export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        header: (props) => <Header {...props}/>
      }}
      tabBar={(props) => <TabBar {...props} /> }
      >
       <Tabs.Screen
          name="Calis"
          options={{
            tabBarLabel: 'Calis',
            title:'',
            tabBarIcon: ({color, focused, size}) => <Ionicons name='ios-flower-sharp' size={size} color={color}/>,
          }}
        />
      <Tabs.Screen  
        name="Cinema"
        options={{
          tabBarIcon: ({color, focused, size}) => <Ionicons name='play' size={size} color={color}/>,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
