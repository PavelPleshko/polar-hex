export function uniqueAttributeGenerator(elementPrefix: string, attrName: string, startCounter = 0): () => string {
	let currentId = startCounter;

	return function nextAttribute(): string {
		return `${elementPrefix}-${attrName}-${currentId++}`;
	};
}

export const uniqueIdGenerator = (
	elementPrefix: string,
	startCounter = 0
): ReturnType<typeof uniqueAttributeGenerator> => uniqueAttributeGenerator(elementPrefix, 'id', startCounter);
