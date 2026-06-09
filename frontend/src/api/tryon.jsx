import axios from "axios";

// Ensure this points to 127.0.0.1 to avoid the network reset bug
const API_BASE_URL = "http://127.0.0.1:8000/api/tryon";

/**
 * Sends the garment, optional person image, and persona data to the FastAPI backend.
 */
export const generateTryOn = async (garmentFile, personFile, persona, categoryHints = {}, garmentBackFile = null) => {
  const formData = new FormData();
  
  formData.append("garment_image", garmentFile);
  if (garmentBackFile) {
    formData.append("garment_back_image", garmentBackFile);
  }
  
  if (personFile) {
    formData.append("person_image", personFile);
  }
  
  formData.append("age_group", persona.ageGroup);
  formData.append("ethnicity", persona.ethnicity);
  formData.append("body_type", persona.bodyType);
  formData.append("gender", persona.gender);
  
  // Join the selected angles array into a string: "Front View,Side Profile"
  formData.append("camera_angles", persona.angles.join(",")); 
  formData.append("backdrop_scene", persona.backdrop); 

  if (categoryHints.category) {
    formData.append("garment_category", categoryHints.category);
  }
  if (categoryHints.subcategory) {
    formData.append("garment_subcategory", categoryHints.subcategory);
  }
  if (categoryHints.description) {
    formData.append("garment_description", categoryHints.description);
  } 

  try {
    const response = await axios.post(`${API_BASE_URL}/generate`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data?.detail || error.message);
    throw error.response?.data?.detail || "Failed to generate try-on";
  }
};

/**
 * Sends a garment file to the backend to get a transparent background-removed PNG.
 */
export const removeBackground = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);
  
  try {
    const response = await axios.post(`${API_BASE_URL}/remove-background`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data; // { image: "data:image/png;base64,...", fallback: boolean }
  } catch (error) {
    console.error("Background Removal Error:", error.response?.data?.detail || error.message);
    throw error.response?.data?.detail || "Failed to remove background";
  }
};