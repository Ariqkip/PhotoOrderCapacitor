//
//  FindAllFilePlugin.swift
//  App
//
//  Created by karsa on 2024/6/4.
//

import Foundation
import Capacitor

@objc(FindDBFilePlugin)
public class FindDBFilePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "FindDBFilePlugin"
    public let jsName = "FindDBFile"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "findDBFile", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "renameDBFile", returnType: CAPPluginReturnPromise)
    ]

    func docFileFullPath(_ fileName: String) -> URL? {
        let paths = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)
        guard let documentsDirectory = paths.first else {
            return nil
        }
        return documentsDirectory.appendingPathComponent(fileName)
    }

    @objc func findDBFile(_ call: CAPPluginCall) {
        let fileName = call.getString("fileName") ?? "junki.sql"
        let createIfNotExist = call.getBool("createIfNotExist") ?? false

        guard let fileURL = self.docFileFullPath(fileName) else {
            call.reject("Unable to access document directory")
            return
        }
        let fileManager = FileManager.default

        if fileManager.fileExists(atPath: fileURL.path) {
            call.resolve([
                "path": fileURL.path,
                "fileIsNewCreated": false
            ])
        } else if createIfNotExist {
            do {
                try "".write(to: fileURL, atomically: true, encoding: .utf8)
                call.resolve([
                    "path": fileURL.path,
                    "fileIsNewCreated": true
                ])
            } catch {
                call.reject("Unable to create file: \(error.localizedDescription)")
            }
        } else {
            call.reject("File not found and createIfNotExist is false")
        }
    }

    @objc func renameDBFile(_ call: CAPPluginCall) {
        let previousName = call.getString("previousName") ?? "junki.sql"
        let freshName = call.getString("freshName") ?? "junkiSQLite.db"

        //two same file
        guard previousName != freshName else {
            call.resolve(["succeed":true, "msg":"two same names"])
            return
        }

        // fresh file exits
        guard let freshURL = self.docFileFullPath(freshName) else {
            call.reject("Unable to access document directory")
            return
        }
        guard !FileManager.default.fileExists(atPath: freshURL.path) else {
            call.resolve(["succeed":true, "msg":"fresh file exits"])
            return
        }

        // previous file not exits
        guard let previousURL = self.docFileFullPath(previousName) else {
            call.reject("Unable to access document directory")
            return
        }
        guard FileManager.default.fileExists(atPath: previousURL.path) else {
            call.reject("previous file not exits")
            return
        }
        do {
            try FileManager.default.moveItem(atPath: previousURL.path, toPath: freshURL.path)
            call.resolve(["succeed":true, "msg":"previous file renamed"])
        } catch {
            call.reject("move file fail \(error.localizedDescription)")
        }
    }
}

