import showPopup from './modules/showPopup.js';
import fetchShows from './modules/hitApi.js';
import likeShow from './modules/likeShow.js';
import './index.css';
import fetchLikeCount from './modules/fetchLikes.js';

const showContainer = document.getElementById('show-container');


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
});
