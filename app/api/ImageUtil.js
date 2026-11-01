import axios from "axios";
import { server_api } from "../config/env.config";
// import api from "../config/axios";
import api from "./axios";
import { isDemoMode } from "../config/demo.config";

class ImageUtil {
  static async getRetrievalUrl(file) {
    if (isDemoMode) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            reject(new Error("Could not read the selected image."));
          }
        };
        reader.onerror = () => {
          reject(reader.error || new Error("Could not read the selected image."));
        };
        reader.readAsDataURL(file);
      });
    }

    const uploadUrl = (await api.get("/s3url")).data.uploadUrl;

    const {
      config: { url },
    } = await api.put(uploadUrl, file, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: false,
    });

    /* Save stored url to file user */
    const fileUrl = url.split("?")[0];

    return fileUrl;
  }
}

export default ImageUtil;
