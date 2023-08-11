const fetchLikeCount = async (itemName) => {
  const API_TOKEN = 'aQgaudShERyXiWvddmpP';
  const url = `https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/${API_TOKEN}/likes`;

  try {
    const response = await fetch(url);
    const likesData = await response.json();
    const itemLikes = likesData.find((item) => item.item_id === itemName);
    return itemLikes ? itemLikes.likes : 0;
  } catch (error) {
    return 0;
  }
};

export default fetchLikeCount;