package com.test.app;

import android.Manifest;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.widget.Button;
import android.widget.Toast;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.getcapacitor.BridgeActivity;
import com.devsoln.plugins.capacitorcontenturiresolver.ContentUriResolverPlugin;

public class MainActivity extends BridgeActivity {
    private static final int PERMISSION_REQUEST_CODE = 1;
    private static final String[] PERMISSIONS = {
            Manifest.permission.READ_EXTERNAL_STORAGE,
            Manifest.permission.WRITE_EXTERNAL_STORAGE,
            Manifest.permission.ACCESS_MEDIA_LOCATION
    };

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        registerPlugin(ContentUriResolverPlugin.class);
        checkPermissions(this);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == PERMISSION_REQUEST_CODE) {
            for (int i = 0; i < permissions.length; i++) {
                if (grantResults[i] == PackageManager.PERMISSION_GRANTED) {
                    Toast.makeText(this, permissions[i] + " permission granted", Toast.LENGTH_LONG).show();
                }
            }
        }
    }

    public void checkPermissions(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            // Android Marshmallow (API 23) and above
            for (String permission : PERMISSIONS) {
                if (ContextCompat.checkSelfPermission(context, permission) != PackageManager.PERMISSION_GRANTED) {
                    ActivityCompat.requestPermissions(this, new String[]{permission}, PERMISSION_REQUEST_CODE);
                }
            }
        } else {
            // For devices running Android versions below Marshmallow
            // Permissions are automatically granted at installation time
        }
    }

    private void showPermissionRequestDialog(final String permission) {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Permission Required");
        builder.setMessage(getPermissionMessage(permission));
        builder.setPositiveButton("Go to Settings", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                Intent intent = new Intent(android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                intent.setData(Uri.parse("package:" + getPackageName()));
                startActivity(intent);
            }
        });
        builder.setNegativeButton("Not Now", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.dismiss();
            }
        });
        AlertDialog dialog = builder.create();
        dialog.show();
        Button positiveButton = dialog.getButton(AlertDialog.BUTTON_POSITIVE);
        Button negativeButton = dialog.getButton(AlertDialog.BUTTON_NEGATIVE);
        positiveButton.setTextColor(Color.BLUE);
        negativeButton.setTextColor(Color.BLACK);
    }

    private String getPermissionMessage(String permission) {
        // Customize permission messages based on the permission requested
        switch (permission) {
            case Manifest.permission.READ_EXTERNAL_STORAGE:
            case Manifest.permission.WRITE_EXTERNAL_STORAGE:
                if (isScopedStorageEnabled()) {
                    return "This app needs access to your device's media files. Please grant the storage permission to proceed.";
                } else {
                    return "This app needs access to your device's external storage. Please grant the storage permission to proceed.";
                }
            case Manifest.permission.ACCESS_MEDIA_LOCATION:
                return "This app needs access to your media location. Please grant the permission to proceed.";
            // Add more cases for additional permissions if needed
            default:
                return "This app needs additional permissions to proceed.";
        }
    }

    private boolean isScopedStorageEnabled() {
        return Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q; // Android 10 (API level 29) and above
    }
}
