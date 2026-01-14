module.exports = {
  presets: [
    'module:@react-native/babel-preset',
    'nativewind/babel',
  ],
  plugins: [
    '@babel/plugin-transform-export-namespace-from',
    [
      'module:react-native-dotenv',
      {
        envName: 'APP_ENV',
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
        verbose: false,
      },
    ],
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
        },
      },
    ],
    // Reanimated plugin MUST be last
    'react-native-reanimated/plugin',
  ],
};
