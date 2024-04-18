package com.devsoln.plugins.capacitorcontenturiresolver;

import android.content.Context;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "ContentUriResolver")
public class ContentUriResolverPlugin extends Plugin {

    private ContentUriResolver implementation = new ContentUriResolver();

    @PluginMethod
    public void echo(PluginCall call) {
        String value = call.getString("value");

        JSObject ret = new JSObject();
        ret.put("value", implementation.echo(value));
        call.resolve(ret);
    }

    @PluginMethod
    public void getAbsolutePathFromContentUri(PluginCall call) {
        String contentUri = call.getString("contentUri");
        Context context = getContext();

        JSObject ret = new JSObject();
        ret.put("absolutePath", implementation.getAbsolutePathFromContentUri(context, contentUri));
        call.resolve(ret);
    }
}
