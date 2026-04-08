export const goalQueryKeys = {
    all: ['goal'] as const,
    lists: () => [...goalQueryKeys.all, 'list'] as const,
    list: () => [...goalQueryKeys.lists()] as const,
    types: () => [...goalQueryKeys.all, 'types'] as const,
};
