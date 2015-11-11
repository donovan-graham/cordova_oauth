#!/bin/bash
rm -rf platforms/ plugins/

cordova plugins add cordova-plugin-inappbrowser@1.0.1
cordova plugins add cordova-plugin-whitelist@1.0.0

cordova platforms add ios@3.9.1
cordova platforms add android@4.1.1