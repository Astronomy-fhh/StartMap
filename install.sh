#!/bin/bash

# 构建 release APK
cd android
./gradlew assembleRelease

# 安装 APK
adb install -r app/build/outputs/apk/release/app-release.apk
