import { Image, TouchableHighlight, View, Text } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming, runOnJS } from "react-native-reanimated";

const GalleryComponent = ({ uri, onLongPress }: {uri: string, onLongPress?: () => void}) => {
    const animationValue = useSharedValue(0);
    const animationStyle = useAnimatedStyle(() => {
        return {
            height: `${animationValue.value}%`,
        };
    });

    const startAnimation = () => {
        animationValue.value = withTiming(100, { duration: 1000 }, () => {
            if (animationValue.value === 100) {
                runOnJS(onLongPress!)();
            }
            animationValue.value = 0; 
        });
    };

    const resetAnimation = () => {
        animationValue.value = 0;
    }

    return <TouchableHighlight underlayColor="#00000000"  className="p-1 w-1/2"
        onPressIn={onLongPress ? startAnimation : undefined}
        onPressOut={onLongPress ? resetAnimation : undefined}
    >
        <View className="w-full aspect-square rounded overflow-hidden shadow-sm shadow-black relative" >
            <Image source={{ uri, method: "cover" }} className="w-full aspect-square" resizeMode={'cover'} />
            <Animated.View style={[animationStyle]} className='bg-red-500/50 w-full absolute bottom-0' />
        </View>
    </TouchableHighlight>

}

export default GalleryComponent;