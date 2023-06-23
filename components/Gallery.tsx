import { FlatList, Alert } from 'react-native';
import GalleryComponent from './GalleryComponent';

interface GalleryProps {
    images: ArrayLike<any>,
    onPressImage?: (assetId?: string) => void,
    onLongPressImage?: (assetId?: string) => void
}


const Gallery = ({ images, onLongPressImage }: GalleryProps) => {

    return <FlatList
        className="p-1 flex-1"
        data={images}
        numColumns={2}
        renderItem={({ item: { uri, assetId }, index }) => {
            return <GalleryComponent uri={uri}  onLongPress={onLongPressImage ? () => onLongPressImage(assetId) : undefined} />
        }}
    />
}

export default Gallery;