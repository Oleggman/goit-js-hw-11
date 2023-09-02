function renderGallery(photos) {  
  return photos.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
      <div class="photo-card">
        <a href="${largeImageURL}"><img class="card-img" src="${webformatURL}" alt="${tags}" title="${tags}"/></a>
        <div class="info">
          <p class="info-item">
            <span class="info-item-title">Likes:</span>
            <span class="info-item-name">${likes}</span>
          </p>
          <p class="info-item">
            <span class="info-item-title">Views:</span>
            <span class="info-item-name">${views}</span>
          </p>
          <p class="info-item">
            <span class="info-item-title">Comments:</span>
            <span class="info-item-name">${comments}</span>
          </p>
          <p class="info-item">
            <span class="info-item-title">Downloads:</span>
            <span class="info-item-name">${downloads}</span>
          </p>
        </div>
      </div>
      `).join('');
}
    
export { renderGallery };
    