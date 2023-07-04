import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePathname, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, TouchableNativeFeedback, Image } from 'react-native'


const ProfilePic = () => {
    const router = useRouter()
    const path = usePathname()
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

    return <View className="rounded-full overflow-hidden">
        <TouchableNativeFeedback onPress={() => router.push('/profile')}>
            <View className="w-10 aspect-square rounded-full overflow-hidden">
                <Image source={{ height: 40, uri: image || "https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg" }} />
            </View>
        </TouchableNativeFeedback>
    </View>

}

export default ProfilePic;