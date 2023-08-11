const likeShow = async (itemName) => {
  const API_TOKEN = 'aQgaudShERyXiWvddmpP';
  const url = `https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/${API_TOKEN}/likes`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        item_id: itemName,
      }),
    });

    if (response.status === 201) {
      // Successfully liked the show
    } else {
      alert.error('Error liking show');
    }
  } catch (error) {
    alert.error('Error:', error);
  }
};

export default likeShow;