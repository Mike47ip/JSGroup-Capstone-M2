const fetchShows = async () => {
  try {
    const response = await fetch('https://api.tvmaze.com/shows');
    return await response.json();
  } catch (error) {
    return error;
  }
};

export default fetchShows;