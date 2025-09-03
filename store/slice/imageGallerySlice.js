import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  galleryImages: [],
  loading: false,
  currentImage: null,
};

const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setGalleryImages: (state, action) => {
      state.galleryImages = action.payload;
    },
    addGalleryImages: (state, action) => {
      state.galleryImages.push(...action.payload);
    },
    removeGalleryImage: (state, action) => {
      state.galleryImages = state.galleryImages.filter(
        (image) => image._id !== action.payload
      );
    },
    removeMultipleGalleryImages: (state, action) => {
      const idsToRemove = action.payload;
      state.galleryImages = state.galleryImages.filter(
        (image) => !idsToRemove.includes(image._id)
      );
    },
    setCurrentImage: (state, action) => {
      state.currentImage = action.payload;
    },
    updateGalleryImage: (state, action) => {
      const { id, data } = action.payload;
      const index = state.galleryImages.findIndex((image) => image._id === id);
      if (index !== -1) {
        state.galleryImages[index] = { ...state.galleryImages[index], ...data };
      }
    },
  },
});

export const {
  setLoading,
  setGalleryImages,
  addGalleryImages,
  removeGalleryImage,
  removeMultipleGalleryImages,
  setCurrentImage,
  updateGalleryImage,
} = gallerySlice.actions;

export default gallerySlice.reducer;
