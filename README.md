# helpsteps-mobile
mobile frontend for helpsteps

Setup
-----------

This application is built with [Ionic](http://ionicframework.com/).  First,
you'll need to install
[Node.js](https://docs.npmjs.com/getting-started/installing-node), a JavaScript
runtime that comes with `npm`, a package manager.

You will also need to have either Xcode, for iOS development, or Android Studio,
for Android development.  Both are available as free downloads.

Then, to install Ionic, run:

```sh
    npm install -g cordova ionic
    cd HelpSteps
    # For iOS development:
    cordova platform add ios
    # For Android development:
    cordova platform android
    cordova plugin add ionic-plugin-keyboard
```

Running
---------------

To run the app in a simulator:

```sh
    ionic emulate <platform>
```

Where `<platform>` is either `ios` or `android`.

To run the app on a device:

```sh
    ionic run <platform>
``` 

Interactive Development
------------------

Since Ionic uses a web view, you can connect to your running app using browser
dev tools.

### iOS ###

  * Launch Safari.
  * If you don't see a *Develop* menu item, go to *Safari* -> *Settings* and
check "Show Develop menu in menu bar".
  * In the *Develop* menu, find "Simulator", if you're developing in the
    simulator, or the name of your device.
  * Select "index.html" under _HelpSteps.html_
