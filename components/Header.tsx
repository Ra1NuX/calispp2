import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Text, TouchableNativeFeedback, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Header: React.FC<any> = ({ ...props }) => {
    const router = useRouter()
    const path = usePathname()
    const inset = useSafeAreaInsets()

    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AsyncStorage.getItem('profilePic').then(uri => {
            if (uri) {
                setImage(uri);
            }
            setLoading(false);
        })
    }, [path])

    return loading ? <Text>Loading</Text> : <View className="flex flex-row bg-color-light p-2" style={{paddingTop: inset.top+8}}>
        <View className="rounded-full overflow-hidden">
            <TouchableNativeFeedback onPress={() => router.push('/profile')}>
                <View className="w-10 aspect-square rounded-full mr-2 overflow-hidden">
                    <Image source={{height: 40, uri: image || "https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg"}}/>
                </View>
            </TouchableNativeFeedback>
        </View>
        <View className="flex justify-center items-center">
            

        </View>
    </View>
    }

export default Header;