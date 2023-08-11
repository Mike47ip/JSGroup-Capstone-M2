const fetchAndDisplayComments = async (itemName) => {
  const API_TOKEN = 'aQgaudShERyXiWvddmpP';
  const url = `https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/${API_TOKEN}/comments?item_id=${itemName}`;

  try {
    const response = await fetch(url);
    const comments = await response.json();
    const commentsDiv = document.getElementById('comments-container');
    commentsDiv.innerHTML = '';

    comments.forEach((comment) => {
      const commentElement = document.createElement('div');
      commentElement.className = 'comment';
      commentElement.innerHTML = `
        <p><strong>${comment.username}</strong>: ${comment.comment}</p>
        <p>Date: ${comment.creation_date}</p>
      `;
      commentsDiv.appendChild(commentElement);
    });
    return comments;
  } catch (error) {
    return error;
  }
};

export default fetchAndDisplayComments;