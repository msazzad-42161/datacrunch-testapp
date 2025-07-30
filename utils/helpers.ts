export function extractAuthorIds(authors: Array<{ author: { key: string }; type: { key: string } }> = []): string[] {
  console.log('extractAuthorIds called with:', authors);
  
  if (!Array.isArray(authors)) {
    console.log('Authors is not an array:', typeof authors);
    return [];
  }
  
  return authors
    .filter(authorObj => {
      // Check if the structure is valid
      if (!authorObj || typeof authorObj !== 'object') {
        console.log('Invalid author object:', authorObj);
        return false;
      }
      
      if (!authorObj.author || typeof authorObj.author !== 'object') {
        console.log('Missing author property:', authorObj);
        return false;
      }
      
      if (!authorObj.author.key || typeof authorObj.author.key !== 'string') {
        console.log('Missing or invalid author key:', authorObj.author);
        return false;
      }
      
      return true;
    })
    .map(authorObj => {
      try {
        return authorObj.author.key.replace('/authors/', '');
      } catch (error) {
        console.error('Error processing author key:', authorObj.author.key, error);
        return '';
      }
    })
    .filter(id => id.length > 0);
}

export function getAuthorNames(authors?: { name: string }[]): string[] {
  if (!authors || authors.length === 0) return [];
  return authors.map((author) => author.name);
}
