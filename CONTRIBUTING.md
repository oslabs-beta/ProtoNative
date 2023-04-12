# Developer Guide for Contributing to ProtoNative

### Instructions

1. After you have forked the project, created your feature branch, and cloned to your local machine, you can begin working on the project.
2. Install the dependencies by running `npm install`.
3. Run `npm start` to start the development server and electron at the same time.
    1. If you are having trouble starting the electron app, you can run `npm run vite` to start the development server and then run `npm run electron` to start the electron app separately.
    2. The vite server must run on `port 3000`. If you are already running a server on that port, kill the process and try again. (You might be able to use `kill -9 $(lsof -t -i:3000)` for this)
4. You should now be able to see the app running in the electron window with hot reloading enabled.
5. Run `npm test` to run the tests on `src/utils/`. That's where we keep the bulk of our functionality.

<br>

### Building the App for Production

1. Building the electron app for production must be done on a machine with the same operating system as the target machine.
2. Run `npm run build:windows` to build the app for Windows.
3. Run `npm run build:mac` to build the app for Mac.
    1. Mac's that use Apple Silicon (M1) will create a different build than Mac's that use Intel processors. We currently have the Intel build showcased on the website which should work on both types of Mac's.
4. The command will create two folders, `build/` and `dist/`.
    1. The `build/` folder contains the vite build which is used to create the electron app.
    2. The `dist/` folder contains the electron app.
5. The `dist/` folder contains an installer in its root directory that can be distributed to users. (ProtoNative Setup 1.0.0.exe or ProtoNative-1.0.0.dmg)
6. After distribution, you may delete the `build/` and `dist/` folders.
