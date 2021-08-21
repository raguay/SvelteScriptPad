
## launch

> This command launches the application from the main install of NW.js.

```zsh
nwjs-sdk/nwjs.app/Contents/MacOS/nwjs Application/ScriptPad > /dev/null 2>&1 &!
```

## build

> This command builds the project into the Application/ScriptPad directory for running the main nwjs installation.

```bash
#
# Build the applicaton.
#
cd Development
npm run build
cd ../Documents
npm run build
cd ../ScriptServer
npm run build
cd ..

#
# Clean our the application directory.
#
rm -R Application/ScriptPad/scriptpad/*
rm -R Application/ScriptPad/docs
rm -R Application/ScriptPad/ScriptServer
rm Development/public/*.map
rm -Rf ~/Library/Caches/ScriptPad
rm -Rf ~/Library/Application\ Support/ScriptPad
rm -Rf Application/ScriptPad/bin
rm -Rf Application/ScriptPad/dialogs
rm -Rf Application/ScriptPad/nodered_modules

#
# Copy the application, and documentation over to the application directory.
#
mkdir Application/ScriptPad/bin
mkdir Application/ScriptPad/dialogs
mkdir Application/ScriptPad/scriptpad/css
mkdir Application/ScriptPad/ScriptServer
mkdir Application/ScriptPad/nodered_modules

cp Development/public/*.css Application/ScriptPad/scriptpad/css
mkdir Application/ScriptPad/scriptpad/js
mkdir Application/ScriptPad/docs
cp Development/public/bundle.js Application/ScriptPad/scriptpad/js
nwjs-sdk/nwjc Development/public/bundle.js Application/ScriptPad/scriptpad/js/bundle.bin

#
# Copy over the codemirror code.
#
mkdir Application/ScriptPad/scriptpad/codemirror
mkdir Application/ScriptPad/scriptpad/codemirror/addon
cp -R Misc/* Application/ScriptPad/scriptpad
cp -R Development/node_modules/codemirror/theme/* Application/ScriptPad/scriptpad/editorthemes
cp -R Development/node_modules/codemirror/lib/* Application/ScriptPad/scriptpad/codemirror
cp -R Development/node_modules/codemirror/mode/javascript/* Application/ScriptPad/scriptpad/codemirror
cp -R Development/node_modules/codemirror/mode/markdown/* Application/ScriptPad/scriptpad/codemirror
cp -R Development/node_modules/codemirror/keymap/* Application/ScriptPad/scriptpad/codemirror
cp -R Development/node_modules/codemirror/addon/* Application/ScriptPad/scriptpad/codemirror/addon

#
# Copy over the documentation items.
#
cp -R Documents/public/* Application/ScriptPad/docs/

#
# Copy the user dialogs.
#
cp dialogs/* Application/ScriptPad/dialogs

#
# Copy the Script Server.
#
mkdir Application/ScriptPad/ScriptServer/js
mkdir Application/ScriptPad/ScriptServer/css
cp ScriptServer/serverIndex.html Application/ScriptPad/ScriptServer/index.html
cp ScriptServer/public/global.css Application/ScriptPad/ScriptServer/css
cp ScriptServer/public/bundle.css Application/ScriptPad/ScriptServer/css
cp ScriptServer/public/bundle.js Application/ScriptPad/ScriptServer/js

#
# Copy NodeRed related items.
#
cp -R NodeRedModules/* Application/ScriptPad/nodered_modules

#
# build the other items.
#
mask buildCommandLine
mask buildModules
```

## buildModules

```bash
#
# Copy over the Modules items.
#
cd Modules/ScriptBar
mask build
cd ../..
cd Modules/BulletinBoard
mask build
cd ../..
rm -Rf Application/ScriptPad/Modules
mkdir Application/ScriptPad/Modules
cp -Rf Modules/* Application/Scriptpad/Modules/
rm -Rf Application/ScriptPad/Modules/ScriptBar/src
rm -Rf Application/ScriptPad/Modules/ScriptBar/maskfile.md
rm -Rf Application/ScriptPad/Modules/ScriptBar/rollup.config.js
rm -Rf Application/ScriptPad/Modules/ScriptBar/img/*.afdesign
rm -Rf Application/ScriptPad/Modules/ScriptBar/node_modules
rm Application/ScriptPad/Modules/BulletinBoard/js/bulletinboard.js
rm -Rf Application/ScriptPad/Modules/BulletinBoard/node_modules
rm Application/ScriptPad/Modules/BulletinBoard/maskfile.md
```

## launchScriptBar

```bash
cd Modules/ScriptBar
mask launch
cd ../..
```

## buildBulletinBoard

```zsh
cd Modules/BulletinBoard
mask build
cd ../..
```

## buildScriptBar

```zsh
cd Modules/ScriptBar
mask build
cd ../..
```

## launchBulletinBoard

```zsh
cd Modules/BulletinBoard
mask launch
cd ../..
```

## CopyToApp

```zsh

rm -R Application/scriptpad.app/Contents/Resourses/app.nw/*
cp -R Application/Scriptpad/ Application/scriptpad.app/Contents/Resourses/app.nw

```

## CopyDialogs

```zsh
cp dialogs/* Application/ScriptPad/dialogs
```

## buildCommandLine

```zsh
cd goHelper
mask build
cp queryUser ../Application/ScriptPad/bin
```

## ClearChromeDir

> This command clears out the Chromium directories.

```zsh
rm -Rf '~/Library/Caches/ScriptPad'
rm -Rf '~/Library/Caches/nwjs'
rm -Rf '~/Library/Caches/BulletinBoard'
rm -Rf '~/Library/Caches/scriptbar'
rm -Rf '~/Library/Application Support/ScriptPad'
rm -Rf '~/Library/Application Support/nwjs'
rm -Rf '~/Library/Application Support/BulletinBoard'
rm -Rf '~/Library/Application Support/scriptbar'

```

## launchSaved

> This command launches the application from the main install of NW.js.

```zsh
nwjs-sdk/nwjs.app/Contents/MacOS/nwjs Application.save/ScriptPad > /dev/null 2>&1 &!
```


## buildApp

> This command is for building the full application into it's own application folder.

```bash
mask build

```

## launchApp

> Run the full application using the open statement.

```bash
/usr/bin/open ./Application/ScriptPad.app
```
