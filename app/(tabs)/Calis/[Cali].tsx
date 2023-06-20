import { Redirect, useLocalSearchParams } from "expo-router";
import { useContext } from "react";
import { Text, View } from "react-native"
import OptionBar from "../../../components/OptionBar";
import { CalisContext } from "../../../contexts/CalisContext";
import { WithId } from "../../../model/Cali";

const CaliOption = () => {
    const { id } = useLocalSearchParams() as unknown as WithId<{}>
    const { calis } = useContext(CalisContext)!;
    
    const selectedCali = calis.find(({id: caliId}) => caliId === id)
    if(!selectedCali) return <Redirect href={'/404'} />

    const { text } = selectedCali;
    
    return <View className="m-3 h-full">
        <Text>{text}</Text>
        <OptionBar Cali={selectedCali}/>
    </View>
}

export default CaliOption;