import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState, useContext } from "react";
import { Share, Text, TouchableNativeFeedback, TouchableHighlight, View, Image } from "react-native";
import { es } from 'date-fns/locale'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import TimeAgo from "./TimeAgo";
import { CaliProps, WithId } from "../model/Cali";
import { getUrlExtension, likeCali, uploadTimesVisited } from "../utils";
import { CalisContext } from "../contexts/CalisContext";
import { Video, ResizeMode } from 'expo-av';


export const Cali = ({ text, date, id, isLiked = false, assets }: WithId<CaliProps>) => {

    const router = useRouter();
    const [liked, setLiked] = useState<boolean>(isLiked);
    const {setCalis} = useContext(CalisContext)!

    const size = useSharedValue(isLiked ? 1 : 0);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{
                scale: size.value
            }],
        };
    });

    const handleHeartPress = () => {
        setLiked((l) => {
            const newLiked = !l;
            if(newLiked === true) {
                size.value = withSpring(1);
            } else {
                size.value = withSpring(0);
            }
            return newLiked;
        });
        likeCali(id, liked, setCalis);
    }

    const handleSharePress = async () => {
        try {
            Share.share({ title: `Cali del dia ${date}:`, message: `${text}` });
        } catch (error) {
            alert({ error })
        }
    }

    const handlePressCali = async () => {
        uploadTimesVisited(id, setCalis);
        router.push({ pathname: `/Calis/${id}`, params: { id } })
    }

    return <View className="rounded-md overflow-hidden shadow shadow-black">
        <TouchableNativeFeedback touchSoundDisabled onPress={handlePressCali}>
            <View className="bg-white p-2 flex flex-col border-b border-color-light/70">
                <Text className="text-base">{text}</Text>
                {assets && assets.length && <View className="flex items-center justify-center m-5 rounded bg-gray-100 p-2 shadow shadow-black/50 overflow-hidden">
                    {
                    (['jpg', 'jpeg', 'tiff'].includes(getUrlExtension(assets[0]))) 
                    ? <Image source={{uri: assets[0]}} className="w-2/3 aspect-square" resizeMethod="resize" blurRadius={2} resizeMode="contain"/>
                    : <Video source={{uri: assets[0]}} isLooping shouldPlay useNativeControls className="w-2/3 aspect-square" resizeMode={ResizeMode.CONTAIN} /> 
                    }
                </View>}
                
                <Text className="text-gray-500 text-right text-xs">
                    <TimeAgo dateTo={new Date(date)} locale={es}/>
                </Text>
                <View className="flex flex-row">
                    <View className="rounded-full overflow-hidden">
                        <TouchableNativeFeedback onPress={handleHeartPress} touchSoundDisabled>
                            <View className="h-6 aspect-square flex items-center justify-center relative">
                                <Ionicons name="heart-outline" color={'#f00'} size={24} />
                                <Animated.View style={[animatedStyle]} className={`absolute`}>
                                    <Ionicons name="heart" color={'#f00'} size={24} />
                                </Animated.View>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                    <View className="rounded-full overflow-hidden">
                        <TouchableNativeFeedback onPress={handleSharePress} touchSoundDisabled>
                            <View className="h-6 aspect-square flex items-center justify-center relative">
                                <Ionicons name="share-social" color={'#9a9a9a'} size={20} />
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                </View>
            </View>
        </TouchableNativeFeedback>
    </View>
}