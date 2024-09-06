package com.devsoln.plugins.capacitorcontenturiresolver;

import android.content.Context;
import android.net.Uri;
import android.util.Log;


public class ContentUriResolver {

    public String echo(String value) {
        Log.i("Echo", value);
        return value;
    }
    public String getAbsolutePathFromContentUri(Context context, String contentUri) {
        Log.i("contentUri", contentUri);
        String imagePath = FilePath.getPath(context, Uri.parse(contentUri));
        if (imagePath != null) {
            Log.e("Image absolute path", imagePath);
        } else {
            Log.e("Error", "Failed to retrieve image path");
        }
        return imagePath;
    }
}