//
//  FindPhoto.swift
//  App
//
//  Created by karsa on 2024/6/27.
//

import Foundation
import Capacitor
import Photos

@objc(FindPhotoPlugin)
public class FindPhotoPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "FindPhotoPlugin"
    public let jsName = "FindPhoto"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "fetchPhotoData", returnType: CAPPluginReturnPromise),
    ]
    
    
    @objc func fetchPhotoData(_ call: CAPPluginCall) {
        guard let localIdentifier = call.getString("localIdentifier") else {
            call.reject("localIdentifier is null")
            return
        }
        let fetchResult = PHAsset.fetchAssets(withLocalIdentifiers: [localIdentifier], options: nil)
        
        guard let asset = fetchResult.firstObject else {
            call.reject("photo not found")
            return
        }
        
        let requestOptions = PHImageRequestOptions()
        requestOptions.isSynchronous = true
        requestOptions.deliveryMode = .highQualityFormat
                
        PHImageManager.default().requestImageDataAndOrientation(for: asset, options: requestOptions) { (imageData, _, _, _) in
            guard let imageData = imageData else {
                call.reject("read photo data failed")
                return
            }
            call.resolve(["data":imageData.base64EncodedString()])
            
        }
    }
}
