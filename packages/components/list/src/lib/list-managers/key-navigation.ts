import { ARROW_DOWN, ARROW_LEFT, ARROW_RIGHT, ARROW_UP, END, HOME } from '@yeti-wc/utils';

export type ListNavigationDelta = -1 | 1;

const SPECIAL_NAVIGATION_KEY_TO_DELTA: Record<string, ListNavigationDelta> = {
	[HOME]: 1,
	[END]: -1,
};

export const VERTICAL_NAVIGATION_KEY_TO_DELTA: Record<string, ListNavigationDelta> = {
	...SPECIAL_NAVIGATION_KEY_TO_DELTA,
	[ARROW_UP]: -1,
	[ARROW_DOWN]: 1,
};

export const HORIZONTAL_NAVIGATION_KEY_TO_DELTA: Record<string, ListNavigationDelta> = {
	...SPECIAL_NAVIGATION_KEY_TO_DELTA,
	[ARROW_LEFT]: -1,
	[ARROW_RIGHT]: 1,
};

const clamp = (num: number, min: number, max: number): number => Math.min(Math.max(num, min), max);

export const calculateNextIndex = (desiredIndex: number, total: number, wrap = true): number => {
	return wrap ? (desiredIndex >= 0 ? desiredIndex % total : total - 1) : clamp(desiredIndex, 0, total - 1);
};
