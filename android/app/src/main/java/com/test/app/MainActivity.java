package com.test.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.devsoln.plugins.capacitorcontenturiresolver.ContentUriResolverPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState){
        registerPlugin(ContentUriResolverPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
