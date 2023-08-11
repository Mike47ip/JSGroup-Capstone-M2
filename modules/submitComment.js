import fetchAndDisplayComments from './fetchDisplayComment.js';
import updateCommentCount from './commentCounter.js';

const submitComment = async (info) => {
  const username = document.getElementById('username').value;
  const comment = document.getElementById('comment').value;
  const API_TOKEN = 'aQgaudShERyXiWvddmpP';
  const currentDate = new Date().toISOString().split('T')[0];

  const data = {
    item_id: info.name,
    username,
    comment,
    creation_date: currentDate,
  };

  const url = `https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/${API_TOKEN}/comments`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.status === 201) {
      await Promise.all([
        fetchAndDisplayComments(info.name),
        updateCommentCount(info.name),
      ]);
    } else {
      alert.error('Error storing comment');
    }
  } catch (error) {
    alert.error('Error:', error);
  }
};

export default submitComment;

