export function applyPagination(documents, page, rowsPerPage) {
  // Return a subset of documents based on the current page and rows per page
  // If documents is null or undefined, use an empty array instead to avoid errors
  return (documents ?? []).slice(
    // Calculate the start index for the current page
    page * rowsPerPage, 
    // Calculate the end index for the current page
    page * rowsPerPage + rowsPerPage);
}
