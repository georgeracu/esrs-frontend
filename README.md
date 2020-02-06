# esrs-frontend

Table of Contents

- [esrs-frontend](#esrs-frontend)
  - [Install Android Studio](#install-android-studio)
    - [Download and run the Android Studio Installer](#download-and-run-the-android-studio-installer)
    - [SDK Component Setup](#sdk-component-setup)
  - [Setting up the Emulator](#setting-up-the-emulator)
  - [Starting the Emulator without Android Studio](#starting-the-emulator-without-android-studio)
  - [Running the application in Android emulator](#running-the-application-in-android-emulator)

## Install Android Studio

- Android SDK
- Android SDK Platform
- Performance (Intel HAXM)
- Android Virtual Device
- Android version 9 (Pie)
- Android SDK Platform 28
- Google APIs Intel x86 Atom System Image
- Android SDK Build-Tools v. 28.0.3

### Download and run the Android Studio Installer

- Choose 'custom' install type
  - Select a theme
  
### SDK Component Setup

- Android SDK
- Android SDK Platform
  - API 29: Android 10.0 (Q)
  - (It may not be possible to select 28 here - you can downgrade the API post-install via: AS Launcher/Configure/SDK Manager-Show Package Details and select 28.0.3)
- Performance (Intel HAXM)
- Android Virtual Device

## Setting up the Emulator

- Add `ANDROID_HOME` path to your environment variables.
  - Open Settings (`WINDOWS+I`)
  - Type "environment" an click "Edit the system environment variables"
  - Click "Environment Variables"
  - Under System Variables, click `NEW`
    - Variable_name: `ANDROID_HOME`
    - Variable_value: `C:\Users\YOUR_ACCOUNT\AppData\Local\Android\Sdk`
    - Click OK
  - Under System Variables again, find `Path` and double click on it to edit, and at the bottom add:
    - `%ANDROID_HOME%\platform-tools`
    - `%ANDROID_HOME%\tools`
    - `%ANDROID_HOME%\tools\bin`

## Starting the Emulator without Android Studio

Note: an Emulator will have to be set up in Android Studio first - this is for all successive launches.

- `emulator -list-avds` - will show all installed AVDs
- `emulator -avd Pixel_3_API_28 -netdelay none -netspeed full` - will run the AVD `Pixel_3_API_28`
- On Windows, specifiying the emulator path is necessary:
  - `%ANDROID_HOME%/emulator/emulator -avd Pixel_3_API_28 -netdelay none -netspeed full` - will run the AVD `Pixel_3_API_28`

## Running the application in Android emulator

`react-native start` - will start the Metro server
`react-native run-android` - will start the application on Android. You need the Android emulator running first