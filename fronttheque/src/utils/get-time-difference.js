export const getTimeDifference = (date) => {
    // Get the current date and time
    const now = new Date();

    // Convert the provided date string to a Date object
    const then = new Date(date);

    // Calculate the difference between the current time and the provided time in milliseconds
    const differenceInMilliseconds = now - then;

    // Convert the difference from milliseconds to seconds
    const differenceInSeconds = differenceInMilliseconds / 1000;
  
    // If the difference is less than 1 minute, return the difference in seconds
    if (differenceInSeconds < 60) {
        return Math.round(differenceInSeconds) + " seconds ago";
    } 

    // If the difference is less than 1 hour, return the difference in minutes
    else if (differenceInSeconds < 3600) {
        return Math.round(differenceInSeconds / 60) + " minutes ago";
    } 
    
    // If the difference is less than 1 day, return the difference in hours
    else if (differenceInSeconds < 86400) {
        return Math.round(differenceInSeconds / 3600) + " hours ago";
    } 
    
    // Otherwise, return the difference in days
    else {
        return Math.round(differenceInSeconds / 86400) + " days ago";
    }
  };