import { useContext, useEffect, useState } from "react"
import { CaliProps, WithId } from "../model/Cali";
import { CalisContext } from "../contexts/CalisContext";
import { getCalis } from "../utils";


export const useFetchCalis = (): [ boolean ] => {
    const [loading, setLoading] = useState<boolean>(false);
    const { setCalis } = useContext(CalisContext)!;
    
    useEffect(() => {
        try {
            setLoading(true);
            getCalis().then(newData => {
                setCalis(() => [...newData as WithId<CaliProps>[]])
            })
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, [])
    return [loading]
}