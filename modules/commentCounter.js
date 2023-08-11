const fetchCommentCount = async (itemName) => {
  const API_TOKEN = 'aQgaudShERyXiWvddmpP';
  const url = `https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/${API_TOKEN}/comments?item_id=${itemName}`;

  try {
    const response = await fetch(url);
    const comments = await response.json();
    return comments.length;
  } catch (error) {
    return 0;
  }
};

const updateCommentCount = async (itemName) => {
  const commentCount = await fetchCommentCount(itemName);
  const commentCountDiv = document.getElementById('comment-count');
  commentCountDiv.innerHTML = `Comments: ${commentCount}`;
};

export default updateCommentCount;