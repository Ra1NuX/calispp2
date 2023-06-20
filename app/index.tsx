import { Redirect, usePathname } from "expo-router"
import { useEffect, useState } from "react";
import { Text } from "react-native";
import * as Updates from 'expo-updates'

const Index = () => {

    useEffect(() => {
        reactToUpdate()
    },[])
    
    const reactToUpdate = () => {
        Updates.addListener(async (event) => {
            if(event.type === Updates.UpdateEventType.UPDATE_AVAILABLE){
                await Updates.reloadAsync()
            }
        })
    }    

    return <Redirect href={'/Calis'} />
}

export default Index;