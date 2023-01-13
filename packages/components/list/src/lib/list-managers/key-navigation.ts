import { ARROW_DOWN, ARROW_LEFT, ARROW_RIGHT, ARROW_UP, END, HOME } from '@ph-wc/utils';

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

export const OUT_OF_BOUND_INDEX = -1;
/**
 * Find the item which can be navigated to and perform navigation.
 * It traverses the items until the first non-disabled option is
 * encountered.
 * Returns either
 * @param items - list of items which is being navigated through
 * @param desiredIndex - index of desired element that should be set as 'active'.
 * Acts as a base point from which traversal starts.
 * @param fallbackStep - which direction it should traverse in the search
 * of most adjacent non-disabled item.
 * @param skipPredicate - will skip element and do the increment with {@param fallbackStep} if returns true
 */
export const getCorrectedNextIndex = <T>({
	items,
	desiredIndex,
	fallbackStep,
	skipPredicate,
}: {
	items: T[];
	desiredIndex: number;
	fallbackStep: ListNavigationDelta;
	skipPredicate: (item: T) => boolean;
}): number => {
	if (!items[desiredIndex]) {
		return OUT_OF_BOUND_INDEX;
	}

	while (skipPredicate(items[desiredIndex])) {
		desiredIndex += fallbackStep;

		if (!items[desiredIndex]) {
			return OUT_OF_BOUND_INDEX;
		}
	}
	return desiredIndex;
};
