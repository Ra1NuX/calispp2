import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { View, Text, TouchableHighlight, TextInput, Image, FlatList } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod'
import * as ImagePicker from 'expo-image-picker';
import { createCali, uploadImageFromUri } from "../../../utils";
import { useContext, useState } from "react";
import { CalisContext } from "../../../contexts/CalisContext";
import { useRouter } from "expo-router";

type FormData = {
    text: string;
}

const schema = z.object({
    text: z.string({required_error: 'Este campo no puede estar vacio!'}).min(1, 'Este campo no puede estar vacio!'),
})


const modal = () => {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<FormData>({
        resolver: zodResolver(schema)
    });
    
    const Router = useRouter()
    const {setCalis} = useContext(CalisContext)!
    const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>()
    
    
    const handleNewCali = async (data: { text: string }) => {
        const { text } = data;
        let urls: string[]|undefined; 
        if(images) {
            urls = await Promise.all(
                images.map(async ({uri, assetId}) => {
                    const milli = new Date().getMilliseconds()
                    const url = uploadImageFromUri(uri, `${milli}-${assetId}`);
                    return url;
                })
            );
        }
        await createCali(text, setCalis, urls);
        reset();
        Router.back();
    }


    const handleAddImage = async () => {
        const images = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            quality: 1,
            allowsMultipleSelection: true,
        })

        if(!images.canceled){
            setImages(images.assets);
        }
    }

    const handlePressImage = (id: string) => {
        setImages((img) => { return [...img!.filter(({assetId}) => assetId !== id )]})
    }

    return <View>
        <Controller
            control={control}
            render={({ field: { ref, onBlur, onChange, value }, fieldState: { error } }) => (
                <>
                    <TextInput
                        ref={ref}
                        selectionColor={'#F2C846'}
                        cursorColor={'#F2C846'}
                        multiline={true}
                        className={`h-48 p-2 mx-2 mt-2 border break-words  ${errors.text ? 'border-red-500' : 'border-transparent'}`}
                        textAlign="left"
                        textAlignVertical="top"
                        placeholder="Mensaje..."
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                    <Text className="mx-2 text-red-500 font-bold">{ error?.message }</Text>
                </>
            )}
            name="text"
        />
        <View className="flex flex-row gap-2 p-2">
            <TouchableHighlight 
                touchSoundDisabled 
                underlayColor={'#F2C84688'} 
                className="p-3 rounded bg-color-light w-[82.5%]" 
                onPress={handleSubmit(handleNewCali)}
            >
                <Text className="text-base text-center">Aceptar</Text>
            </TouchableHighlight>
            <TouchableHighlight className="p-3 rounded overflow-hidden" underlayColor='#00000022' onPress={handleAddImage}>
                <MaterialCommunityIcons name="paperclip" size={25} />
            </TouchableHighlight>
        </View>
        <FlatList 
            className="p-1 max-h-[410px]"
            data={images}
            numColumns={2} 
            renderItem={({item: {uri, assetId}, index}) => 
            <TouchableHighlight underlayColor='#fafafa55' className="p-1 w-1/2" onLongPress={() => handlePressImage(assetId!)}>
                <View key={index} className="w-full aspect-square rounded overflow-hidden shadow-sm shadow-black"> 
                    <Image source={{uri, method: "cover"}} className="w-full aspect-square" resizeMode={'cover'} />
                </View> 
            </TouchableHighlight>
            } />
    </View>
}

export default modal;