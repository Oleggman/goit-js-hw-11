import axios from "axios";

class ServiceImage {
  constructor() {
    this.API_URL = 'https://pixabay.com/api';
    this.API_KEY = '39209629-f3132ec928ad5cd36f2b712c3';
  }

  async fetchImage(querry) {
    const params = new URLSearchParams({
      key: this.API_KEY,
      q: querry,
      image_type: "photo",
      orientation: "horizontal",
      safesearch: true,
    });

    const response = await axios(`${this.API_URL}?${params}`);
    return response.data.hits;
  }

}

export default ServiceImage;