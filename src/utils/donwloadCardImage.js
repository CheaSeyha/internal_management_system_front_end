// utils/downloadCardImages.js
import axios from "../api/axios";

export const downloadCardImages = async (cards) => {
  return Promise.all(
    cards.map(async (card) => {
      if (card.profile_image_url && !card.local_image_url) {
        try {
          const response = await axios.get(card.profile_image_url, {
            responseType: "blob",
          });
          const imageBlob = URL.createObjectURL(response.data);
          return { ...card, local_image_url: imageBlob };
        } catch (err) {
          console.error("Error downloading image for card:", card.id, err);
          return { ...card, local_image_url: null };
        }
      }
      return card;
    })
  );
};
