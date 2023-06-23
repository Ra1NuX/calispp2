import { Image, ScrollView, Text, View, TouchableNativeFeedback } from "react-native"
import { useState, Dispatch, SetStateAction } from 'react'
import { WebView } from 'react-native-webview';

interface ItemProps {
    title: string;
    src: string;
    url: string;
    setActive: Dispatch<SetStateAction<{
        url: string;
        title: string;
        src: string;
    }>>;
}

const items = [
    { url: 'https://mega.nz/embed/iAAWgRKC#TRYSRDpWz82ZqD40KPGc0ICg174chNMltgzuVT47InE', title: 'Coraline', src: 'https://static.wikia.nocookie.net/doblaje/images/3/39/CoralineylaPuertaSecreta.jpg/revision/latest/scale-to-width-down/1200?cb=20201012161345&path-prefix=es' },
    { url: 'https://mega.nz/embed/aEpijTYR#YvLRaRawHvAttj92yQx2xs0xHecXLyIw2I5nr88yQKE', title: 'Hunger Games', src: 'https://3.bp.blogspot.com/-jG3Xsm2r-YQ/T2kYCTczgUI/AAAAAAAABSo/z_D_Xb5dkPQ/s1600/HungerGamesPosterKatniss.jpg' },
    { url: 'https://mega.nz/embed/PZQRQCbC#YN43xt9qh7OClnrPOrynlHGnpg-cpekc0QyM-ef-K0k', title: 'Teen Beach Movie', src: 'https://www.formulatv.com/images/tvmovies/posters/000/86/1_m1.jpg' },
]
const iframe = (url: string) => `<iframe width="100%" height="100%" frameborder="0" src="${url}" allowfullscreen ></iframe>`


const Item = ({ url, title, src, setActive }: ItemProps) => {
    return <TouchableNativeFeedback onPress={() => setActive({url, title, src})} className="bg-red-500">
        <View className="m-3 mx-2 w-[65vw] bg-white shadow-md shadow-black rounded-xl overflow-hidden">
            <View className="bg-color-light flex items-center justify-center">
                <Image source={{ uri: src, method: 'cover' }} className="w-full aspect-[9/14]" />
            </View>
            <Text className="font-bold text-center text-xl overflow-hidden p-3">{title}</Text>
        </View>
    </TouchableNativeFeedback>
}

const Carrousel = () => {

    const [active, setActive] = useState(items[0])

    return <View className="flex justify-between h-screen pb-24">
        <View className="w-full aspect-video bg-yellow-500 rounded-lg overflow-hidden my-5">
            <WebView
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                source={{ html: iframe(active.url) }}
                scalesPageToFit={true}
                allowsFullscreenVideo
            />
        </View>
        <View className="flex ">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {items.map((props) => <Item key={props.title} setActive={setActive} {...props} />)}
            </ScrollView>
        </View>
    </View>
}

export default Carrousel;