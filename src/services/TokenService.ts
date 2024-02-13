import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Filesystem, Directory } from '@capacitor/filesystem';

let dbConnection: SQLiteDBConnection;

const createDbConnection = async () => {
    if (!dbConnection) {
        const sqlite = new SQLiteConnection(CapacitorSQLite);
        dbConnection = await sqlite.createConnection(
            '/data/user/0/photoorder.droid/files/junki', 
            false, 
            'no-encryption', 
            1, 
            false
        );
    }
    return dbConnection;
}

export const getOldToken = async () => {
    try {
        await Filesystem.rename({
            from: '/data/user/0/photoorder.droid/files/junki.sql',
            to: '/data/user/0/photoorder.droid/files/junkiSQLite.db',
        });

        const db = await createDbConnection();

        await db.open();

        const query = "SELECT * FROM Settings WHERE key='OriginalUserEnteredToken';";
        const result = await db.query(query);

        if (result?.values) {
            return result.values[0].Value;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error getting old token:', error);
        return null;
    }
};

export const getSettingsInfo = async () => {
    try {
        const db = await createDbConnection();

        await db.open();

        const query = "SELECT * FROM Settings WHERE key='UserName' OR key='UserPhone' OR key='UserEmail' OR key='PhotographerAddress';";
        const result = await db.query(query);

        if (result?.values) {
            return result.values;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error getting old token:', error);
        return null;
    }
};

export const getUnsavedImages = async () => {
    try {
        const db = await createDbConnection();

        await db.open();

        const query = "SELECT ProductId, Count, ImagePath, FileName FROM OrderItem;";
        const result = await db.query(query);

        if (!result) return;
        
        const formattedImages = result?.values?.map(image => ({
            ProductId: image.ProductId,
            Count: image.Count,
            ImagePath: image.ImagePath,
            FileName: image.FileName
        }));

        await addImageDataToFormattedImages(formattedImages);
        
        return formattedImages;
    } catch (error) {
        console.error('Error getting unsaved images:', error);
        throw error;
    }
};

const getImageData = async (imagePath: string) => {
    try {
        const imageData = await getImageFromDevice(imagePath);
        
        return imageData;
    } catch (error) {
        console.error('Error fetching image data:', error);
        throw error;
    }
};

const addImageDataToFormattedImages = async (formattedImages: any) => {
    for (let i = 0; i < formattedImages.length; i++) {
        const imgObj = formattedImages[i];
        const imageData = await getImageData(imgObj.ImagePath);
        imgObj.imageData = `data:image/png;base64,${imageData.data}`
    }
};

const getImageFromDevice = async (initPath: string) => {
    try {
        const path = getShortImagePath(initPath);
        const file = await Filesystem.readFile({
            path: path,
            directory: Directory.ExternalStorage
        });
        
        return file;
    } catch (error) {
        console.error('Error getting image from device:', error);
        throw error;
    }
};

const getShortImagePath = (path: string) => {
    const slashIndices = [];
  
    for (let i = 0; i < path?.length; i++) {
        if (path[i] === '/') {
            slashIndices.push(i);
        }
    }

    if (slashIndices.length < 4) {
        return path;
    }
    
    return path.substring(slashIndices[3]);
};

export const getLastOrderImageFromDevice = async (initPath: string) => {
    try {
        const path = extractFilePath(initPath);
        const file = await Filesystem.readFile({
            path: path,
            directory: Directory.ExternalStorage
        });
        return file.data;
    } catch (error) {
        console.error('Error getting image from device:', error);
        throw error;
    }
};

const extractFilePath = (inputString: string) => {
    const parts = inputString.split('%2F');
    const encodedPath = parts.slice(4).join('/');
    const decodedPath = decodeURIComponent(encodedPath);
    return '/' + decodedPath;
}