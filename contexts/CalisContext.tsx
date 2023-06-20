import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, Dispatch, ReactElement, SetStateAction, useState, useEffect } from "react";
import { CaliProps, WithId } from "../model/Cali";

export const CalisContext = createContext<{ calis: WithId<CaliProps>[], setCalis: Dispatch<SetStateAction<WithId<CaliProps>[]>> } | null>(null);


export const CalisProvider = ({ children }: { children: ReactElement }) => {

    const [calis, setCalis] = useState<WithId<CaliProps>[]>([])
    console.log('render context')

    return <CalisContext.Provider value={{ calis, setCalis }}>
        {children}
    </CalisContext.Provider>
}