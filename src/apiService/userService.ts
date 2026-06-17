import axios from "axios";

export const uploadImage = async (file: any) => {
  const formData = new FormData();
  const CLOUD_NAME = "dd4xje8fc";
  const UPLOAD_PRESET = "copy-trading";

  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const { data } = await axios.post(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    formData
  );

  return data.secure_url;
};