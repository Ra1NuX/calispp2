import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { TouchableOpacity, View, Text } from "react-native";

const TabBar: React.FC<BottomTabBarProps> = ({
    state,
    descriptors,
    navigation,
}) => {
    return (
        <View className={`flex flex-row bg-color-light relative justify-around`}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];

                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                let Icon;
                if (options.tabBarIcon) {
                    Icon = options.tabBarIcon({
                        focused: isFocused,
                        color: isFocused ? "#a038c1" : "#483c15",
                        size: 28,
                    });
                }

                const onPress = () => {
                    const event = navigation.emit({
                        type: "tabPress",
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: "tabLongPress",
                        target: route.key,
                    });
                };
                return (
                    <View 
                    key={route.key}
                    className={`overflow-hidden flex transition-all bg-color-light duration-75 p-2 items-center relative`}>
                        <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}

                        >
                            <View className={`aspect-square flex flex-col items-center justify-center rounded-lg p-3 ${isFocused ? 'bg-moon-light/20' : ''}`}>
                                {Icon}
                            </View>
                        </TouchableOpacity>
                    </View>
                )
            })}
        </View>
    );
};

export default TabBar