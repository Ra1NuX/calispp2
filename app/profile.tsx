import { useContext, useState, useEffect } from "react";
import { Image, ScrollView, Text, TouchableHighlight, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Cali } from "../components/Cali";
import { CalisContext } from "../contexts/CalisContext";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storage } from "../utils/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { fetchImageFromUri } from "../utils/fetchImageFromUri";


const Profile = () => {
    const inset = useSafeAreaInsets();
    const { calis } = useContext(CalisContext)!

    const firsCaliOfThisYear = [...calis].reverse().find(({ date }) => {
        return (new Date()).getFullYear() === (new Date(date)).getFullYear()
    }) || calis[0];

    const moreVisitedCali = [...calis].sort((a, b) => (b.timesVisited || 0) - (a.timesVisited || 0))[0]

    const [profileImage, setProfileImage] = useState('');
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        AsyncStorage.getItem('profilePic').then(uri => {
            if (uri) {
                setProfileImage(uri);
            }
            setLoading(false);
        })
    }, [])
    


    const handleChangeProfilePic = async () => {
        const profilePic = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1
        })
        if (!profilePic.canceled) {
            const { uri } = profilePic.assets[0]
            const profilePickRef = ref(storage, 'user/profile.jpg');
            if(uri) {
                const image = await fetchImageFromUri(uri)
                await uploadBytes(profilePickRef, image);
                const url = await getDownloadURL(profilePickRef);
                setProfileImage(url);
                await AsyncStorage.setItem('profilePic', url);
            }
        }
    }

    const totalAssets = [...calis.flatMap(({assets}) => assets )].length

    return loading ? <Text>Loading</Text> : <View style={{ paddingTop: inset.top + 24 }} className="w-full h-full bg-color-light">
        <View className="w-full h-full bg-white rounded-t-3xl">
            <View className="flex flex-row">
                <View className="w-24 mt-6 ml-5 aspect-square bg-color-light rounded-3xl overflow-hidden">
                    <TouchableHighlight onPress={handleChangeProfilePic}>
                        <Image source={{ height: 96, uri: profileImage || "https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg" }} />
                    </TouchableHighlight>
                </View>
                <View>
                    <Text className="text-xl font-bold mt-5 ml-5"> Welcome </Text>
                    <Text className="block ml-5 mt-2 text-7xl font-extrabold text-color-light">Tina!</Text>
                </View>
                <View className="w-10 ml-4 flex justify-end pb-5">
                    <Image source={{ height: 50, width: 50, uri: "https://images.emojiterra.com/google/noto-emoji/unicode-15/color/512px/2764.png" }} />
                </View>
            </View>
            <View>
                <View className="mx-5 mt-5">
                    <Text className="text-2xl border-b text-yellow-600/40 border-yellow-600/40 mb-2">Estadísticas:</Text>
                </View>
                <ScrollView className="mb space-y-2 h-[580px]" showsVerticalScrollIndicator alwaysBounceVertical>
                    <View className="flex flex-row justify-around px-5">
                        <View className="flex items-center justify-center gap-2">
                            <Text className="text-xl font-bold">Calis</Text>
                            <Text className="p-2 rounded bg-moon-light/20 sahdow shadow-black/50 aspect-square text-center">{calis.length}</Text>
                        </View>
                        <View className="flex items-center justify-center gap-2">
                            <Text className="text-xl font-bold">Imagenes</Text>
                            <Text className="p-2 rounded bg-moon-light/20 sahdow shadow-black/50 aspect-square text-center">{totalAssets}</Text>
                        </View>
                    </View>
                    <View className="p-5">
                        <Text className="text-xl font-bold mb-2">Cali más visitado:</Text>    
                        <Cali {...moreVisitedCali} />
                    </View>
                    <View className="p-5">
                        <Text className="text-xl font-bold mb-2">Primer cali del año {(new Date()).getFullYear()}:</Text>
                        <Cali {...firsCaliOfThisYear} />
                    </View>
                </ScrollView>

            </View>
        </View>
    </View>
}

export default Profile;