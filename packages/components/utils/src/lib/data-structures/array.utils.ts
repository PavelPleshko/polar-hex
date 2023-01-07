type ComparisonResult = -1 | 0 | 1;
const defaultSortComparator = <T = any>(a: T, b: T): ComparisonResult => {
	return a > b ? 1 : a < b ? -1 : 0;
};

/**
 * Merges two sorted arrays so the elements appear also in the sorted manner
 * in the output array. Allows to remove duplicates.
 */
export const mergeSorted = <T = any>(arrayA: T[], arrayB: T[], comparatorFn = defaultSortComparator): T[] => {
	const lengthA = arrayA.length;
	const lengthB = arrayB.length;

	let cursorA = 0;
	let cursorB = 0;
	const result: T[] = [];

	// we run this loop until one of the cursors overflows its corresponding
	// array length. This means that we merged all elements from that array into the result.
	while (cursorA < lengthA && cursorB < lengthB) {
		const itemA = arrayA[cursorA];
		const itemB = arrayB[cursorB];
		const comparisonResult = comparatorFn(itemA, itemB);

		switch (comparisonResult) {
			case -1:
				result.push(itemA);
				cursorA++;
				break;
			case 1:
				result.push(itemB);
				cursorB++;
				break;
			case 0:
				// when items are the same in both arrays - we push the item from first array
				// and second if the duplication is allowed
				result.push(itemA);
				cursorA++;
				cursorB++;
				break;
		}
	}

	// once we have one of the arrays depleted - we merge the rest of the elements
	if (cursorA < lengthA) {
		result.push(...arrayA.slice(cursorA));
	} else {
		result.push(...arrayB.slice(cursorB));
	}

	return result;
};

export const diffSorted = <T>(arrayA: T[], arrayB: T[], comparatorFn = defaultSortComparator): T[] => {
	const lengthA = arrayA.length;
	const lengthB = arrayB.length;

	let cursorA = 0;
	let cursorB = 0;
	const result: T[] = [];

	// we run this loop until one of the cursors overflows its corresponding
	// array length. This means that we merged all elements from that array into the result.
	while (cursorA < lengthA && cursorB < lengthB) {
		const itemA = arrayA[cursorA];
		const itemB = arrayB[cursorB];
		const comparisonResult = comparatorFn(itemA, itemB);

		switch (comparisonResult) {
			case -1:
				result.push(itemA);
				cursorA++;
				break;
			case 1:
				cursorB++;
				break;
			case 0:
				// when items are the same in both arrays - we simply increment cursors for both
				cursorA++;
				break;
		}
	}

	// once we have one of the arrays depleted - we merge the rest of the elements
	if (cursorA < lengthA) {
		result.push(...arrayA.slice(cursorA));
	}

	return result;
};

export const includedIndices = <T>(sourceItems: T[], includeOnly: T[]): number[] => {
	return sourceItems.reduce((acc, curr, index) => {
		if (includeOnly.includes(curr)) {
			acc.push(index);
		}
		return acc;
	}, [] as number[]);
};

export const indicesToValues = <T, V>(
	sourceItems: T[],
	indices: number[],
	extractionFn = (item: T): V => item as unknown as V
): V[] => {
	return sourceItems.reduce((acc, curr, i) => {
		if (indices.includes(i)) {
			acc.push(extractionFn(curr));
		}
		return acc;
	}, [] as V[]);
};
