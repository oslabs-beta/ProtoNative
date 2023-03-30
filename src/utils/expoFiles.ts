type expoFile = {
  contents: string,
  name: string
};

const packageJSON: expoFile = {
  contents: 
`{
  "name": "testing",
  "version": "1.0.0",
  "description": "",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~48.0.9",
    "expo-status-bar": "~1.4.4",
    "react": "18.2.0",
    "react-native": "0.71.4"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0"
  },
  "private": true
}`,
  name: 'package.json'
}


const babelConfig: expoFile = {
  contents: 
`module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};`,
  name: 'babel.config.js'
}

const appJSON: expoFile = {
  contents: 
`{
  "expo": {
    "name": "",
    "slug": "",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "light",
  
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    }
  }
}`,
  name: 'app.json'
} 


const gitIgnore: expoFile = {
  contents: 
`node_modules
.expo`,
  name: '.gitignore'
}

export const expoFiles = [packageJSON, babelConfig, appJSON, gitIgnore];