module.exports = isEmpty = (item) => (
        item === undefined || 
        item === null ||
        (typeof item === 'object' && Object.keys(item).length === 0) ||
        (typeof item === 'string' && item.trim().length === 0)
    );
