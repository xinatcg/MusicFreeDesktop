// See the Electron documentation for details on how to use preload scripts:

import { contextBridge, ipcRenderer } from "electron";
import ipcRendererDelegate from "./internal/ipc-renderer-delegate";
import fsDelegate from "./internal/fs-delegate";
import themepack from "./internal/themepack";

// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts




contextBridge.exposeInMainWorld('ipcRenderer', ipcRendererDelegate);
contextBridge.exposeInMainWorld('fs', fsDelegate);
contextBridge.exposeInMainWorld('themepack', themepack);


