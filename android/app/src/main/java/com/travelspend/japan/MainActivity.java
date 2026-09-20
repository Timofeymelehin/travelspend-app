package com.travelspend.japan;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import androidx.core.content.FileProvider;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.Plugin;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.File;

@CapacitorPlugin(name = "AppUpdater")
public class MainActivity extends BridgeActivity {

    @PluginMethod
    public void installApk(com.getcapacitor.PluginCall call) {
        String filePath = call.getString("filePath");
        if (filePath == null) {
            call.reject("File path is null");
            return;
        }

        File apkFile = new File(filePath);
        Intent intent = new Intent(Intent.ACTION_VIEW);
        
        Uri apkUri;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            apkUri = FileProvider.getUriForFile(this, getApplicationContext().getPackageName() + ".fileprovider", apkFile);
            intent.setDataAndType(apkUri, "application/vnd.android.package-archive");
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        } else {
            apkUri = Uri.fromFile(apkFile);
            intent.setDataAndType(apkUri, "application/vnd.android.package-archive");
        }

        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        try {
            startActivity(intent);
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to install APK: " + e.getMessage());
        }
    }
}
