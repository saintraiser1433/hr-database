export const parseId = (id: string): number | null => {
    const parsedId = parseInt(id, 10);
    return isNaN(parsedId) ? null : parsedId;
};