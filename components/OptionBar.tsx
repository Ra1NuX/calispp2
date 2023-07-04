import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { debounce } from "lodash";
import { ReactElement, useContext, useEffect, useState } from "react"
import { TouchableNativeFeedback, View, Alert } from "react-native"
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { CalisContext } from "../contexts/CalisContext";
import { CaliProps, WithId } from "../model/Cali";
import { deleteCali, likeCali } from "../utils";


interface OptionProps {
    icon: ReactElement;
    className?: string;
    mainClassName?: string;
    onClick: () => void;
}

const Options = ({ className, mainClassName, icon, onClick }: OptionProps) =>
    <View className={`h-[52px] aspect-square overflow-hidden rounded-2xl m-1 bg-emerald-200 ${mainClassName}`}>
        <TouchableNativeFeedback onPress={onClick}>
            <View className={`${className} h-full aspect-square flex items-center justify-center bg-color-light`}>
                {icon}
            </View>
        </TouchableNativeFeedback>
    </View>


interface OptionsProps {
    cali: WithId<CaliProps>,
    handleEdit: () => void;
}

const OptionBar = ({ cali, handleEdit }: OptionsProps ) => {
    const [open, setOpen] = useState(false);
    const rotation = useSharedValue(0);
    const width = useSharedValue(0);
    const Router = useRouter();

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        };
    });

    const animationOpenStyle = useAnimatedStyle(() => {
        return {
            width: `${width.value}%`
        }
    })

    const { isLiked, id } = cali;
    const [like, setLike] = useState(isLiked || false);
    const { setCalis } = useContext(CalisContext)!

    const handleLike = () => {
        setLike((l) => {
            const newliked = !l;
            return newliked;
        })
        likeCali(id, like, setCalis);
    }

    const handleDelete = () => {
        Alert.alert('Eliminar', '¿Estás segura de que quieres eliminar este Cali?', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'OK',
                onPress: () => {
                    deleteCali(id, setCalis);
                    Router.back();
                },
                style: 'destructive'
            }
        ], {
            cancelable: true
        })
    }
    const handleMenu = () => {
        if (!open) {
            setOpen(true)
            setTimeout(() => {
                width.value = withTiming(35, { duration: 200 })
                rotation.value = withTiming(-180);
            }, 5)

        } else {
            rotation.value = withTiming(0);
            width.value = withTiming(1, { duration: 200 });
            setTimeout(() => setOpen(false), 200)
        }
    }

    return <View className="w-full absolute bottom-0 rounded flex flex-row-reverse justify-start">
        <Animated.View style={[animatedStyle]} className="z-10 inline-block">
            <Options mainClassName="shadow shadow-black" icon={<Ionicons name={open ? "close" : "menu"} size={40} color="#fff" />} onClick={debounce(handleMenu, 100)} />
        </Animated.View>

        <Animated.View style={[animationOpenStyle]} className={`${!open ? 'hidden' : 'flex'} items-start flex-row rounded-full overflow-hidden`}>
            <Options icon={<Ionicons name={like ? "heart" : "heart-outline"} size={30} color="#fff" />} onClick={handleLike} />
            <Options icon={<Ionicons name="car-sharp" size={30} color="#fff" />} onClick={() => null} />
            {/* <Options icon={<Ionicons name="share-social" size={30} color="#fff" />} onClick={() => null} /> */}
            {/* <Options icon={<Ionicons name="pencil" size={30} color="#fff" />} onClick={handleEdit} /> */}
            <Options icon={<Ionicons name="trash" size={30} color="#fff" />} onClick={handleDelete} />
        </Animated.View>
    </View>
}

export default OptionBar