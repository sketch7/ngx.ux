export enum DeviceType {
	desktop = "desktop",
	mobile = "mobile",
	tablet = "tablet"
}

export interface ViewportSize {
	width: number;
	height: number;
}

/** Interface for ViewportSize Service  */
export interface IViewportSize {
	get: () => ViewportSize;
}
