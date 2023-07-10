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
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { debounce } from "lodash";

export const Cali = ({ text, date, id, isLiked = false, assets }: WithId<CaliProps>) => {

    const router = useRouter();
    const [liked, setLiked] = useState<boolean>(isLiked);
    const [play, setPlayed] = useState<boolean>(false);
    const { setCalis } = useContext(CalisContext)!

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
            if (newLiked === true) {
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
            if(assets?.length) {
                const today = new Date();
                const downloadPath = `${FileSystem.cacheDirectory}${today.getMilliseconds()}.${getUrlExtension(assets[0])}`;
                const { uri: localUrl } = await FileSystem.downloadAsync(
                    assets[0],
                    downloadPath
                  );
                
                if (await Sharing.isAvailableAsync()) {
                    await Sharing.shareAsync(localUrl,
                        {
                            dialogTitle: `Cali del dia ${date}: ${text}`,
                        });
                }
            } else {
                Share.share({
                    message: `${text}`,
                    title: `Cali del dia ${date}: ${text}`
                })
            }
        } catch (error) {
            alert( error )
        }
    }

    const handlePressCali = async () => {
        uploadTimesVisited(id, setCalis);
        router.push({ pathname: `/Calis/${id}`, params: { id } })
    }

    const handlePlay = () => {
        setPlayed(p => !p)
    }

    const isImage = () => ['jpg', 'jpeg', 'tiff'].includes(getUrlExtension(assets![0]))

    return <View className="rounded-xl overflow-hidden shadow shadow-black">
        <TouchableNativeFeedback touchSoundDisabled onPress={debounce(handlePressCali, 300)}>
            <View className="bg-white p-2 flex flex-col">
                <Text className="text-base m-1 p-2">{text || ''}</Text>
                {assets && assets.length && <View className="flex items-center justify-center m-3 rounded-2xl bg-transparent overflow-hidden">
                    {
                        
                        isImage() ? <Image source={{ uri: assets[0] }} className="w-full aspect-square" resizeMethod="resize" blurRadius={2} resizeMode="contain" />
                            : <Video source={{ uri: assets[0] }} isLooping shouldPlay={!play} className="w-full aspect-square" resizeMode={ResizeMode.CONTAIN} />
                    }
                </View>}
                {/* 
                <Text className="text-gray-500 text-right text-xs m-3 mb-0">
                    <TimeAgo dateTo={new Date(date)} locale={es} />
                </Text> */}
                <View className="flex flex-row justify-between mt-2">
                    <View className="flex flex-row gap-2">
                        <View className="rounded-xl overflow-hidden bg-white">
                            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#ff000022', false)} onPress={debounce(handleHeartPress, 200)} >
                                <View className="p-2 aspect-square flex items-center justify-center relative">
                                    <Ionicons name="heart-outline" color={'#f00'} size={24} />
                                    <Animated.View style={[animatedStyle]} className={`absolute`}>
                                        <Ionicons name="heart" color={'#f00'} size={24} />
                                    </Animated.View>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                        <View className="rounded-xl overflow-hidden bg-white">
                            <TouchableNativeFeedback onPress={debounce(handleSharePress, 200)} touchSoundDisabled>
                                <View className="p-2 aspect-square flex items-center justify-center relative">
                                    <Ionicons name="share-social" color={'#9a9a9a'} size={24} />
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                    </View>
                    { assets && assets.length && !isImage() && <View className="flex flex-row gap-2">
                        <View className="rounded-xl overflow-hidden bg-white">
                            <TouchableNativeFeedback onPress={debounce(handlePlay, 200)} touchSoundDisabled>
                                <View className="p-2 aspect-square flex items-center justify-center relative">
                                    <Ionicons name={play ? "play" : "pause"} color={'#9a9a9a'} size={24} />
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                    </View>}
                </View>
            </View>
        </TouchableNativeFeedback>
    </View>
}