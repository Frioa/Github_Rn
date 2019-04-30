/**
 * @format
 */

import {AppRegistry} from 'react-native';
import AppNavigator from './js/navigator/AppNavigator';
import {createAppContainer} from 'react-navigation'
import {name as appName} from './app.json';
// navigator 3.X 中需要createAppContainer包裹

AppRegistry.registerComponent(appName, () => AppNavigator);
