import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { Filesystem } from '@capacitor/filesystem';

export const getOldToken = async () => {
    try {
        await Filesystem.rename({
            from: '/data/user/0/photoorder.droid/files/junki.sql',
            to: '/data/user/0/photoorder.droid/files/junkiSQLite.db',
        });

        const sqlite = new SQLiteConnection(CapacitorSQLite);
        const db = await sqlite.createConnection(
            '/data/user/0/photoorder.droid/files/junki', 
            false, 
            'no-encryption', 
            1, 
            true
        );

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
