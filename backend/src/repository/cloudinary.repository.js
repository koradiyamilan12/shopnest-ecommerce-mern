const cloudinary = require("../config/cloudinary");

const uploadImage = (filePath) => cloudinary.uploader.upload(filePath);

module.exports = {
  uploadImage,
};
