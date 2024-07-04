import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { registerPlugin, Capacitor } from '@capacitor/core';
const FindDBFileIniOS = registerPlugin('FindDBFile');
const FindPhotoIniOS = registerPlugin('FindPhoto');

class DatabaseService {
  constructor() {
    this.dbConnection = null;
  }

  async createDbConnection() {
    const sqlite = new SQLiteConnection(CapacitorSQLite);
    if (Capacitor.getPlatform() === 'ios') {
      // connect junkiSQLite.db
      return await sqlite.createConnection(
        'junki',
        false,
        'no-encryption',
        1,
        false
      );
    }

    return await sqlite.createConnection(
      '/data/user/0/photoorder.droid/files/junki',
      false,
      'no-encryption',
      1,
      false
    );
  }

  async getDbConnection() {
    if (!this.dbConnection) {
      this.dbConnection = await this.createDbConnection();
    }
    return this.dbConnection;
  }

  async getOldToken() {
    try {
      if (Capacitor.getPlatform() === 'android') {
        await Filesystem.rename({
          from: '/data/user/0/photoorder.droid/files/junki.sql',
          to: '/data/user/0/photoorder.droid/files/junkiSQLite.db',
        });
      } else if (Capacitor.getPlatform() === 'ios') {
        // find previous db file
        try {
          const result = await FindDBFileIniOS.findDBFile({
            fileName: 'junki.sql',
            createIfNotExist: false,
          });
          console.log(
            'ios previous db file found at path ',
            result.path,
            'fileIsNewCreated ',
            result.fileIsNewCreated
          );
        } catch (error) {
          console.log('ios previous db file path not found with err', error);
        }

        // move junki.sql to junkiSQLite.db if needed
        const result = await FindDBFileIniOS.renameDBFile({
          previousName: 'junki.sql',
          freshName: 'junkiSQLite.db',
        });
        console.log('rename file result ', result);
      }

      console.log('dbConnection1', JSON.stringify(this.dbConnection));
      const db = await this.getDbConnection();

      console.log('start open db');
      await db.open();

      const query =
        "SELECT * FROM Settings WHERE key='OriginalUserEnteredToken';";
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
  }

  async getSettingsInfo() {
    try {
      console.log('dbConnection2', JSON.stringify(this.dbConnection));
      const db = await this.getDbConnection();

      await db.open();

      const query =
        "SELECT * FROM Settings WHERE key='UserName' OR key='UserPhone' OR key='UserEmail' OR key='PhotographerAddress';";
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
  }

  async getUnsavedImages() {
    try {
      console.log('dbConnection3', JSON.stringify(this.dbConnection));
      const db = await this.getDbConnection();

      await db.open();

      const query =
        'SELECT ProductId, Count, LocalImageId, ImagePath, FileName, CategoryId FROM OrderItem;';
      const result = await db.query(query);

      if (!result) return;

      const formattedImages = result?.values?.map((image) => ({
        ProductId: image.ProductId,
        Count: image.Count,
        ImagePath: image.ImagePath,
        FileName: image.FileName,
        categoryId: image.CategoryId,
        LocalImageId: image.LocalImageId,
      }));

      await this.addImageDataToFormattedImages(formattedImages);
      return formattedImages;
    } catch (error) {
      console.error('Error getting unsaved images:', error);
      throw error;
    }
  }

  async getImageData(imgObj) {
    try {
      if (Capacitor.getPlatform() === 'ios') {
        //从相册读取照片
        return await this.fetchiOSPhotoDataByID(imgObj.LocalImageId)?.data;
      } else {
        const imageData = await this.getImageFromDevice(imgObj.imagePath);
        return imageData;
      }
    } catch (error) {
      console.error(
        'getImageData Error fetching image data from path ',
        imgObj.imagePath,
        'error ',
        error
      );
      throw error;
    }
  }

  async addImageDataToFormattedImages(formattedImages) {
    for (let i = 0; i < formattedImages.length; i++) {
      const imgObj = formattedImages[i];
      const imageData = await this.getImageData(imgObj);
      imgObj.imageData = `data:image/png;base64,${imageData?.data}`;
    }
  }

  async getImageFromDevice(initPath) {
    try {
      const path = this.getShortImagePath(initPath);
      const file = await Filesystem.readFile({
        path: path,
        directory: Directory.ExternalStorage,
      });

      return file;
    } catch (error) {
      console.error('Error getting image from device:', error);
      throw error;
    }
  }

  async pickPhotoFromIOS() {
    // {files:[{localId,data}]} // data is represent by base64 of jpeg data
    return await FindPhotoIniOS.pickPhotos();
  }

  // return data is represent by base64 of jpeg data
  async fetchiOSPhotoDataByID(localID) {
    return await FindPhotoIniOS.fetchPhotoData({
      localIdentifier: localID,
    });
  }

  getShortImagePath(path) {
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
  }

  async getLastOrderImageFromDevice(initPath) {
    try {
      const path1 = this.getShortImagePath(initPath);
      const path2 = this.extractFilePath(initPath);

      let file;
      try {
        file = await Filesystem.readFile({
          path: path1,
          directory: Directory.ExternalStorage,
        });
      } catch (error) {
        console.error(`Error reading file from path1: ${path1}`, error);

        file = await Filesystem.readFile({
          path: path2,
          directory: Directory.ExternalStorage,
        });
      }

      return file;
    } catch (error) {
      console.error('Error getting image from device:', error);
      throw error;
    }
  }

  async getReuploadedFiles(initPath) {
    try {
      const path = this.extractFilePath(initPath);
      const file = await Filesystem.readFile({
        path: path,
        directory: Directory.ExternalStorage,
      });
      return file;
    } catch (error) {
      console.error('Error getting image from device:', error);
      throw error;
    }
  }

  extractFilePath(inputString) {
    const parts = inputString.split('%2F');
    const encodedPath = parts.slice(4).join('/');
    const decodedPath = decodeURIComponent(encodedPath);
    return '/' + decodedPath;
  }

  async readImageContent(initPath) {
    try {
      const file = await Filesystem.readFile({
        path: initPath,
      });

      return file;
    } catch (error) {
      console.error(
        'readImageContent Error getting image from device with path',
        initPath,
        'failed with err: ',
        error
      );
      throw error;
    }
  }
}

export default new DatabaseService();
