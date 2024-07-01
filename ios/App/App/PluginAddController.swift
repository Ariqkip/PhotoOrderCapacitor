//
//  PluginAddController.swift
//  App
//
//  Created by karsa on 2024/6/4.
//


import UIKit
import Capacitor

class PluginAddController: CAPBridgeViewController {
    // additional code
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(FindDBFilePlugin())
        bridge?.registerPluginInstance(FindPhotoPlugin())
    }
}

