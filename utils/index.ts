import { setDoc, doc, addDoc, collection, query, where, getDocs, increment, updateDoc } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";
import { CaliProps, WithId } from "../model/Cali";
import { db, storage } from "./firebase";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchImageFromUri } from "./fetchImageFromUri";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

type SetCalis = Dispatch<SetStateAction<WithId<CaliProps>[]>>

export const likeCali = (id: string, like: boolean, setCalis: SetCalis ) => {
    const docRef = doc(db, 'notes', id);
    setDoc(docRef,
        {
            isLiked: like
        },
        {
            merge: true
        }
    )
    setCalis(data => {
        const selectedCali = data.find(({ id: selectedId }) => selectedId == id);
        if (!selectedCali) return data;
        selectedCali.isLiked = like;
        const newData = [selectedCali, ...data.filter(({ id: selectedId }) => selectedId !== id)].sort((a, b) => {
            return b.date - a.date
        })
        AsyncStorage.setItem('calis', JSON.stringify(newData)).catch(console.log)
        return newData
    })
}

export const createCali = async (text: string, setData: SetCalis, assets?: string[]) => {
    try {
        const newCali: CaliProps = {
            date: Date.now(),
            text,
            inactive: false,
        }

        if(assets) newCali.assets = assets;
        
        const docRef = await addDoc(collection(db, 'notes'), newCali);
        newCali.id = docRef.id;
        setData((data) => {
            const newData = [newCali as WithId<CaliProps>, ...data];
            AsyncStorage.setItem('calis', JSON.stringify(newData)).catch(console.log)
            return newData;
        })
    } catch (error) {
        console.log(error);
    }
}

export const deleteCali = async (id: string, setCalis: SetCalis) => {
    try {
        const docRef = doc(db, 'notes', id);
        setDoc(docRef, {inactive: true}, {merge: true});
        setCalis((data) => {
            const newData = [...data.filter(({id: selectedId}) => selectedId !== id )];
            AsyncStorage.setItem('calis', JSON.stringify(newData)).catch(console.log);
            return newData;
        })
    }catch(e){
        console.log(e);
    }
}

export const getCalis = async (): Promise<WithId<CaliProps>[]> => {
    const storageNotes = await AsyncStorage.getItem('calis');
    const notes: WithId<CaliProps>[] = storageNotes ? JSON.parse(storageNotes) : []

    if (notes.length === 0) {
        const notesRef = query(collection(db, "notes"), where('inactive', "!=", true));
        console.log('doing a query')
        const notesQuery = await getDocs(notesRef);
        notesQuery.forEach((doc) => {
            notes.push({ id: doc.id, ...doc.data() as CaliProps });
        })

        notes.sort((a, b) => {
            return b.date - a.date
        })

        const jsonNotes = JSON.stringify(notes);
        await AsyncStorage.setItem('calis', jsonNotes);
    }

    return notes
};

export const getUrlExtension = (url: string) => {
    return url.split(/[#?]/)[0].split('.').pop()?.trim() || '';
}

export const isImgUrl = async (url:string) =>  {
    const res = await fetch(url, { method: 'HEAD' });
    return res.headers.get('Content-Type')!.startsWith('image');
  }

export const uploadImageFromUri = async (uri: string, filename: string, route?: string, callback?: (url:string) => void ) => {
    const extension = getUrlExtension(uri)
    const profilePickRef = ref(storage, `${route || 'cali'}/${filename}.${extension}`);
    const image = await fetchImageFromUri(uri)

    
    await uploadBytes(profilePickRef, image);
    const url = await getDownloadURL(profilePickRef);

    if(callback) callback(url)

    return url;
}

export const uploadTimesVisited = (id: string, setCalis: SetCalis) => {
    const docRef = doc(db, 'notes', id);
    const newTimes = increment(1);
    updateDoc(docRef, {
        timesVisited: newTimes
    })
    setCalis(data => {
        const selectedCali = data.find(({ id: selectedId }) => selectedId == id);
        if (!selectedCali) return data;
        selectedCali.timesVisited = ( selectedCali.timesVisited || 0 ) + 1  ;
        const newData = [selectedCali, ...data.filter(({ id: selectedId }) => selectedId !== id)].sort((a, b) => {
            return b.date - a.date
        })
        AsyncStorage.setItem('calis', JSON.stringify(newData)).catch(console.log)
        return newData
    })
}