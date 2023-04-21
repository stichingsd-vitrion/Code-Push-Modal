import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

export const SYNC_STATUS_SYNCING = 'syncing';
export const SYNC_STATUS_STORE_UPDATE = 'store_update';
export const SYNC_STATUS_UPDATE_AVAILABLE = 'update_available';
export const SYNC_STATUS_UPDATE_INSTALLED = 'update_installed';
export const SYNC_STATUS_UPDATE_RESTARTING = 'update_restarting';

export const dialogWidth = width - 20;
export const dialogHeight = height * 0.8;
export const progressBarWidth = dialogWidth - 40;
