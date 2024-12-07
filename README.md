# Handicraft Store Application using React + TypeScript + Vite

This is minimalistic Ecomerce application where admin can sell their products through this application.

## Basic Requirements

- Setup 1: Download and Install [vs-code](https://code.visualstudio.com/Download)
- Setup 2: Download and Install [Node.js](https://nodejs.org/en)
- Setup 3: Download and Install [Gitbash](https://git-scm.com/downloads).
- Setup 4: Setup an [Appwrite](https://appwrite.io/) Account

## Setup the Project

- Cloning Project

```bash
git clone https://github.com/MuhammadKalimullahkhan/econix.git
cd <project-name>
```

- Installing Modules and packages

```bash
npm install
```

- After installing Modules `Rename` the `.env.sample` to `.env` or `.env.local` **OR**
  Add `.env.local` file to the root of the project where `package.json` file is located. And add the following VARIABLES

```bash
# App Settings
VITE_APP_NAME=handicraft store

# Appwrite
VITE_APPWRITE_URL= "https://cloud.appwrite.io/v1" # or replace this if changed
VITE_APPWRITE_PROJECT_ID= # Appwrite project id
VITE_APPWRITE_DATABASE_ID= # Appwrite database id
VITE_APPWRITE_BUCKET_ID= # Appwrite bucket id

# Create the following collection in appwrite database and copy paste each collection ID
VITE_APPWRITE_USERS_COLLECTION_ID=
VITE_APPWRITE_REVIEWS_COLLECTION_ID=
VITE_APPWRITE_PRODUCTS_COLLECTION_ID=
VITE_APPWRITE_ORDERS_COLLECTION_ID=
VITE_APPWRITE_SHIPMENT_COLLECTION_ID=
VITE_APPWRITE_PAYMENTS_METHODS_COLLECTION_ID=
VITE_APPWRITE_SALES_COLLECTION_ID=
VITE_APPWRITE_CATEGORIES_COLLECTION_ID=

#WHATS APP SETTINGS
VITE_WHATS_APP_API=https://api.whatsapp.com/send/
VITE_WHATS_APP_CONTACT=WHATSAPP_CONTACT_NO #+9234xxxxxxx
VITE_WHATS_APP_MESSAGE=Hello Dear, I am interested in your product.
```

- run the project

```bash
npm run dev
# or
npm run dev:lan
```

## Packaging to Android/IOS App

- install and configuring [Capacitor](https://capacitorjs.com/)

```bash
# installing capacitor
npm install @capacitor/core @capacitor/cli
npx cap init [name] [id] --web-dir=dist
# example
npx cap init TestingApp com.yourcompony.testingapp --web-dir=dist
```

- `[name]` is the name of your app i.e `Youtube`.
- `[id]` is the domain name for app `com.google.android.youtube`.
- `[--web-dir]` locates the `final build` directory of your project. i.e `build` or `dist`

You can change these information in `capacitor.config.ts` file.

```bash
# build project
npm run build
```

```bash
# for IOS and Android
npm i @capacitor/ios @capacitor/android
npx cap add android
npx cap add ios

# or for android only
npm i @capacitor/android
npx cap add android

# or for IOS only
npm i @capacitor/ios
npx cap add ios
```

```bash
# Open capacitor project in Android Studio
npx cap open android
```

```bash
# If you want to rebuild android or ios app
npm run build && npx cap sync

# open application in android emulator
npx cap run android
```

If you want to reflect the new `Changes` in capacitor project (android or ios project) you will have to `rebuild` and `sync` the project.

## Technologies used

- **React:** For fast and effecient frontend experience.
- **Typescript:** For type-safty and reuseablity and maintainablity.
- **Appwrite:** For backend.
- **Redux Toolkit:** For state management.
- **React Query:** For Fast and Effecient data retrivement.
- **Tailwind CSS:** For fast coding experience.
- **Capacitor:** For Packaging React App in to Android or iOS App (Not implemented in this Demo).
