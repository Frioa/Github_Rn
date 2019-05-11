/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './js/App';
// navigator 3.X 中需要createAppContainer包裹

AppRegistry.registerComponent(appName, () => App);
