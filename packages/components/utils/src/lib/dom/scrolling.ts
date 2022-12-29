/**
 * Scrolls into the view relative where target is placed.
 */
export const scrollToTarget = (scrollableContainer: HTMLElement, targetEl?: HTMLElement): void => {
	const scrollableDimensions = scrollableContainer.getBoundingClientRect();
	const targetRect = targetEl?.getBoundingClientRect() ?? scrollableDimensions;

	if (targetRect.bottom > scrollableDimensions.bottom) {
		scrollableContainer.scrollTop =
			scrollableContainer.scrollTop + (targetRect.bottom - scrollableDimensions.bottom);
	}
	if (targetRect.top < scrollableDimensions.top) {
		scrollableContainer.scrollTop = scrollableContainer.scrollTop - (scrollableDimensions.top - targetRect.top);
	}
};
