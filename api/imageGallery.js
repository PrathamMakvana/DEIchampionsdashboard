// You'll need to create this slice
import {
  addGalleryImages,
  removeGalleryImage,
  removeMultipleGalleryImages,
  setGalleryImages,
  setLoading,
} from "@/store/slice/imageGallerySlice";
import { fetcher, fetcherDelete, fetcherPost } from "@/utils/axios";

// Get all gallery images
export const getGalleryImages = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await fetcher("/gallery");
    dispatch(setGalleryImages(res?.data || []));
    dispatch(setLoading(false));
    return res;
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    dispatch(setLoading(false));
    return null;
  }
};

// Upload new images to gallery
export const uploadGalleryImages =
  (files, { showSuccess, showError }) =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));

      const formData = new FormData();
      files.forEach((file) => {
        formData.append("galleryImages", file);
      });

      const res = await fetcherPost(["/gallery/upload", formData]);

      if (res?.success) {
        dispatch(addGalleryImages(res.data));
        dispatch(getGalleryImages());
        dispatch(setLoading(false));
        showSuccess("Images uploaded successfully!");
        return res;
      } else {
        throw new Error(res?.message || "Upload failed");
      }
    } catch (error) {
      console.error("Error uploading gallery images:", error);
      dispatch(setLoading(false));
      showError(error?.response?.data?.message || "Failed to upload images.");
      return null;
    }
  };

// Delete a single image
export const deleteGalleryImage =
  (imageId, { showSuccess, showError }) =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await fetcherDelete([`/gallery/${imageId}`]);

      if (res?.success) {
        dispatch(removeGalleryImage(imageId));
        dispatch(setLoading(false));
        showSuccess("Image deleted successfully!");
        return res;
      } else {
        throw new Error(res?.message || "Delete failed");
      }
    } catch (error) {
      console.error("Error deleting gallery image:", error);
      dispatch(setLoading(false));
      showError(error?.response?.data?.message || "Failed to delete image.");
      return null;
    }
  };

// Delete multiple images
export const deleteMultipleGalleryImages =
  (imageIds, { showSuccess, showError }) =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await fetcherPost(["/gallery", { imageIds }]);

      if (res?.success) {
        dispatch(removeMultipleGalleryImages(imageIds));
        dispatch(setLoading(false));
        dispatch(getGalleryImages());
        showSuccess(`${imageIds.length} image(s) deleted successfully!`);
        return res;
      } else {
        throw new Error(res?.message || "Delete failed");
      }
    } catch (error) {
      console.error("Error deleting multiple gallery images:", error);
      dispatch(setLoading(false));
      showError(error?.response?.data?.message || "Failed to delete images.");
      return null;
    }
  };

// Update image (e.g., alt text)
export const updateGalleryImage =
  (imageId, updateData, { showSuccess, showError }) =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));
      //   const res = await fetcherPut([`/gallery/${imageId}`, updateData]);

      if (res?.success) {
        // Refresh gallery images after update
        dispatch(getGalleryImages());
        dispatch(setLoading(false));
        showSuccess("Image updated successfully!");
        return res;
      } else {
        throw new Error(res?.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating gallery image:", error);
      dispatch(setLoading(false));
      showError(error?.response?.data?.message || "Failed to update image.");
      return null;
    }
  };
