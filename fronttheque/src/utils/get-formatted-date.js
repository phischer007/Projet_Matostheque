export const formatDate = (date) => {
    const loanDate = new Date(date);
    const formattedDate = loanDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    return formattedDate;
};

export const formatDetailedDate = (date) => {
    const loanDate = new Date(date);
    const formattedDate = loanDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    });
    return formattedDate;
};
