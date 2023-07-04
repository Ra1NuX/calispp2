import { es } from "date-fns/locale";
import { Redirect, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native"
import Gallery from "../../../components/Gallery";
import OptionBar from "../../../components/OptionBar";
import TimeAgo from "../../../components/TimeAgo";
import { CalisContext } from "../../../contexts/CalisContext";
import { WithId } from "../../../model/Cali";

const CaliOption = () => {
    const { id } = useLocalSearchParams() as unknown as WithId<{}>
    const { calis } = useContext(CalisContext)!;
    const [images, setImages] = useState<{ uri: string }[]>([]);
    const [editMode, setEditMode] = useState(false);

    const selectedCali = calis.find(({ id: caliId }) => caliId === id)
    if (!selectedCali) return <Redirect href={'/404'} />


    useEffect(() => {
        if (selectedCali.assets?.length) {
            setImages(selectedCali.assets.map((item) => ({ uri: item })))
        }
    }, [])

    const { text, date } = selectedCali;

    const handleEdit = () => {
        setEditMode(em => !em)
    };

    return <View className="m-3 h-[96.5%] flex flex-col ">
        { editMode 
            ? <TextInput numberOfLines={5} autoFocus textAlign="left" textAlignVertical="top" className="border rounded border-color-light p-2" >{text}</TextInput> 
            : <Text className="p-2 py-5">{text}</Text>
        }
        
        <Text className="text-gray-500 text-right text-xs m-3 mb-5">
            <TimeAgo dateTo={new Date(date)} locale={es} />
        </Text>
        <View className="rounded-2xl overflow-hidden flex-1">
            {images?.length !== 0 && <Gallery images={images} />}
        </View>
        <OptionBar cali={selectedCali} handleEdit={handleEdit} />
    </View>
}

export default CaliOption;