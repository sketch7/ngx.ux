import { DeviceType } from "./viewport.model";

export interface UxViewportOptions {
	/** Polling speed on resizing (in milliseconds). */
	resizePollingSpeed: number;

	serverDeviceType: DeviceType;
}