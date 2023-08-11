

const showContainer = document.getElementById('show-container');
const popupContainer = document.getElementById('popup-container');
const popupContent = document.getElementById('popup-content');
const closePopupButton = document.getElementById('close-popup');
const showPopupButton = document.getElementById('show-popup-button');

let currentShow = null;

const fetchShows = async () => {
  try {
    const response = await fetch('https://api.tvmaze.com/shows');
    return await response.json();
  } catch (error) {
    return error;
  }
};

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

const updateCommentCount = async (itemName) => {
  const commentCount = await fetchCommentCount(itemName);
  const commentCountDiv = document.getElementById('comment-count');
  commentCountDiv.innerHTML = `Comments: ${commentCount}`;
};

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

const showPopup = async (info) => {
  currentShow = info;

  popupContent.innerHTML = `
    <img src="${info.image.medium}" alt="${info.name}">
    <h2>${info.name}</h2>
    <p>${info.summary}</p>
    <p>Language: ${info.language}</p>
    <p>Ratings: ${info.rating.average}</p>
    
    <form id="comment-form">
      <label for="username">Your Name:</label>
      <input type="text" id="username" required><br>
      <label for="comment">Comments:</label>
      <textarea id="comment" rows="4" required></textarea><br>
      <button type="submit">Submit Comment</button>
    </form>
    
    <div id="comments-container"></div>
    <div id="comment-count"></div>
    
    <button class="like-button">Like</button>
    <div class="like-count">Likes: 0</div>

    <button id="close-popup">Close</button>
  `;
  popupContainer.style.display = 'flex';

  const commentForm = document.getElementById('comment-form');
  const likeButton = popupContent.querySelector('.like-button');
  const likeCount = popupContent.querySelector('.like-count');

  commentForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    await submitComment(info);
    await fetchAndDisplayComments(info.name);
    await updateCommentCount(info.name);
    document.getElementById('username').value = '';
    document.getElementById('comment').value = '';
  });

  likeButton.addEventListener('click', async () => {
    await likeShow(info.name);
    const updatedLikeCount = await fetchLikeCount(info.name);
    likeCount.textContent = `Likes: ${updatedLikeCount}`;
  });

  await fetchAndDisplayComments(info.name);
  closePopupButton.addEventListener('click', closePopup);
  await updateCommentCount(info.name);
};

const closePopup = () => {
  popupContainer.style.display = 'none';
  currentShow = null;
  closePopupButton.removeEventListener('click', closePopup);
};

document.addEventListener('DOMContentLoaded', async () => {
  const shows = await fetchShows();
  shows.forEach(async (show) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${show.image.medium}" alt="${show.name}">
      <p>${show.name}</p>
      <button class="like-button">Like</button>
      <div class="like-count">Likes: 0</div>
    `;

    const likeButton = card.querySelector('.like-button');
    const likeCount = card.querySelector('.like-count');

    const initialLikeCount = await fetchLikeCount(show.name);
    likeCount.textContent = `Likes: ${initialLikeCount}`;

    likeButton.addEventListener('click', async () => {
      await likeShow(show.name);
      const updatedLikeCount = await fetchLikeCount(show.name);
      likeCount.textContent = `Likes: ${updatedLikeCount}`;
    });

    card.addEventListener('click', (event) => {
      if (!event.target.classList.contains('like-button')) {
        showPopup(show);
      }
    });

    showContainer.appendChild(card);
  });

  showPopupButton.addEventListener('click', () => {
    if (currentShow) {
      showPopup(currentShow);
    }
  });
});
