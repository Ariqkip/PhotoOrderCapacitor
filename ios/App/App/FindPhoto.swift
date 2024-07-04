//
//  FindPhoto.swift
//  App
//
//  Created by karsa on 2024/6/27.
//

import Foundation
import Capacitor
import Photos
import PhotosUI

@objc(FindPhotoPlugin)
public class FindPhotoPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "FindPhotoPlugin"
    public let jsName = "FindPhoto"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "fetchPhotoData", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "pickPhotos", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "showImagePicker", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "showPhotoPicker", returnType: CAPPluginReturnPromise),
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
        requestOptions.version = .original
        requestOptions.deliveryMode = .highQualityFormat
        PHImageManager.default().requestImageDataAndOrientation(for: asset, options: requestOptions) { (imageData, _, _, _) in
            guard let imageData = imageData else {
                call.reject("read photo data failed")
                return
            }
            guard let image = UIImage(data: imageData) else {
                call.reject("read photo data failed")
                return
            }
            guard let jpegData = image.jpegData(compressionQuality: 0.8) else {
                call.reject("read photo data failed")
                return
            }
            call.resolve([
                "name": (asset.value(forKey: "filename") as? String) ?? "",
                "data":jpegData.base64EncodedString(),
                "widh":image.size.width,
                "height":image.size.height,
            ])
            
        }
    }
    
    // js core excuting with single thread so we can avoid thread security handling
    private var pickPhotoCall : CAPPluginCall? = nil
    @objc func pickPhotos(_ call: CAPPluginCall) {
        if #available(iOS 14, *) {
            self.showPhotoPicker(call)
        } else {
            self.showImagePicker(call)
        }
    }
}

extension FindPhotoPlugin : UIImagePickerControllerDelegate {
    @objc func showImagePicker(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            self.pickPhotoCall = call
            let picker = UIImagePickerController()
            picker.delegate = self
            picker.sourceType = .photoLibrary
            picker.mediaTypes = ["public.image"]
            picker.modalPresentationStyle = .popover
            self.bridge?.viewController?.present(picker, animated: true, completion: nil)
        }
    }
    
    public func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
        picker.dismiss(animated: true) {
            guard let image = info[.originalImage] as? UIImage else {
                self.pickPhotoCall?.reject("Error loading image")
                return
            }
            guard let jpegData = image.jpegData(compressionQuality: 0.8) else {
                self.pickPhotoCall?.reject("Error loading image")
                return
            }
            guard let asset = info[UIImagePickerController.InfoKey.phAsset] as? PHAsset else {
                self.pickPhotoCall?.reject("Error loading image")
                return
            }
            
            guard let name = asset.value(forKey: "filename") as? String else {
                self.pickPhotoCall?.reject("Error loading image")
                return
            }
            self.pickPhotoCall?.resolve(["files":[[
                "localId": asset.localIdentifier,
                "data":jpegData.base64EncodedString(),
                "name":name,
                "width":asset.pixelWidth,
                "height":asset.pixelHeight,
            ]]])
            
        }
    }
    public func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
        picker.dismiss(animated: true)
        self.pickPhotoCall?.reject("User cancelled photos app")
    }
}

@available(iOS 14, *)
extension FindPhotoPlugin : PHPickerViewControllerDelegate {
    @available(iOS 14, *)
    @objc func showPhotoPicker(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            self.pickPhotoCall = call
            var configuration = PHPickerConfiguration(photoLibrary: PHPhotoLibrary.shared())
            configuration.selectionLimit = 0
            configuration.filter = .images
            let picker = PHPickerViewController(configuration: configuration)
            picker.delegate = self
            self.bridge?.viewController?.present(picker, animated: true, completion: nil)
        }
    }
    
    public func picker(_ picker: PHPickerViewController, didFinishPicking results: [PHPickerResult]) {
        picker.dismiss(animated: true) {
            guard let result = results.first else {
                self.pickPhotoCall?.reject("User cancelled photos app")
                return
            }
            
            let group = DispatchGroup()
            var imageList = [[String:Any]]()
            for result in results {
                if result.itemProvider.hasItemConformingToTypeIdentifier(UTType.image.identifier) {
                    group.enter()
                    result.itemProvider.loadFileRepresentation(forTypeIdentifier: UTType.image.identifier, completionHandler: { url, error in
                        defer {
                            group.leave()
                        }
                        if let error = error {
                            self.pickPhotoCall?.reject("Error loading image \(error)")
                            return
                        }
                        guard let localId = result.assetIdentifier else {
                            self.pickPhotoCall?.reject("Error loading image")
                            return
                        }
                        guard let url = url else {
                            self.pickPhotoCall?.reject("Error loading image")
                            return
                        }
                        let name = url.lastPathComponent
                        do {
                            guard let image = try UIImage(data: Data.init(contentsOf: url)) else {
                                self.pickPhotoCall?.reject("Error loading image")
                                return
                            }
                            guard let jpegData = image.jpegData(compressionQuality: 0.8) else {
                                self.pickPhotoCall?.reject("Error loading image")
                                return
                            }
                            imageList.append([
                                "data":jpegData.base64EncodedString(),
                                "name":name,
                                "localId":localId,
                                "width":image.size.width,
                                "height":image.size.height,
                            ])
                        } catch {
                            self.pickPhotoCall?.reject("Error loading image \(error)")
                        }
                    })
                } else {
                    self.pickPhotoCall?.reject("Error loading image")
                    return
                }
            }
            group.notify(queue: DispatchQueue.main) {
                self.pickPhotoCall?.resolve(["files": imageList])
            }
        }
    }
}


extension FindPhotoPlugin : UINavigationControllerDelegate, UIPopoverPresentationControllerDelegate {
    public func popoverPresentationControllerDidDismissPopover(_ popoverPresentationController: UIPopoverPresentationController) {
        self.pickPhotoCall?.reject("User cancelled photos app")
    }

    public func presentationControllerDidDismiss(_ presentationController: UIPresentationController) {
        self.pickPhotoCall?.reject("User cancelled photos app")
    }
}
