import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ReactElement, useContext, useState } from "react"
import { TouchableNativeFeedback, View, Alert } from "react-native"
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
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
    <View className={`h-[52px] aspect-square overflow-hidden rounded-full mx-1 my-1 ${mainClassName}`}>
        <TouchableNativeFeedback onPress={onClick}>
            <View className={`${className} h-[52px] aspect-square flex items-center justify-center rounded-full bg-color-light`}>
                {icon}
            </View>
        </TouchableNativeFeedback>
    </View>


const OptionBar = ({ Cali }: { Cali: WithId<CaliProps> }) => {
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

    const { isLiked, id } = Cali;
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

    return <View className="h-16 w-full absolute bottom-3 rounded flex flex-row-reverse justify-start mb-2">
        <Animated.View style={[animatedStyle]} className="z-10">
            <Options mainClassName="shadow shadow-black" icon={<Ionicons name={open ? "add" : "menu"} size={30} color="#fff" />} onClick={() => {
                setOpen(o => !o);
                if (!open) {
                    rotation.value = withSpring(-45);
                    width.value = withSpring(100, { mass: 1, damping: 40 })
                } else {
                    rotation.value = withSpring(0);
                    width.value = withSpring(1, { mass: 1, damping: 40 });
                }
            }} />
        </Animated.View>
        {open &&
            <Animated.View style={[animationOpenStyle]} className="flex items-start flex-row rounded-full overflow-hidden right-16">
                <Options icon={<Ionicons name={like ? "heart" : "heart-outline"} size={20} color="#fff" />} onClick={handleLike} />
                <Options icon={<Ionicons name="car-sharp" size={20} color="#fff" />} onClick={() => null} />
                <Options icon={<Ionicons name="share-social" size={20} color="#fff" />} onClick={() => null} />
                <Options icon={<Ionicons name="pencil" size={20} color="#fff" />} onClick={() => null} />
                <Options icon={<Ionicons name="trash" size={20} color="#fff" />} onClick={handleDelete} />
            </Animated.View>}
    </View>
}

export default OptionBar