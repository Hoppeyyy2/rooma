import axios from "axios";
// import MOCK_URL from "../../constants/mock_server_url";
import { server_api } from "../config/env.config";
import api from "./axios";
import { requestDemoApi } from "./demo.api";
import { isDemoMode } from "../config/demo.config";

const serverCrash =
  "Wow the server MAY have crashed...be a hero, and tell Hailey, Jason or Sean ASAP. Please also remember the steps leading to this.";

const updateProfile = (user_obj, cb) => {
  if (isDemoMode) {
    try {
      cb(null, requestDemoApi({
        method: "patch",
        url: `${server_api}user/update`,
        data: user_obj,
      }));
    } catch (error) {
      cb(error);
    }
    return;
  }

  axios
    .patch(`${server_api}user/update`, user_obj, {
      withCredentials: true,
    })
    .then((response) => {
      console.log("patch updateProfile response");
      console.log(response);
      cb(null, response);
    })
    .catch((error) => {
      console.log("patch updateProfile error");
      console.log(error);

      if (!error.response) {
        cb(new Error(serverCrash));
      } else {
        cb(
          "Color selection failed, please check your credential, or contact Hailey, Jason or Sean"
        );
      }
    });
};

const getRetrieveUrl = async (file) => {
  const uploadUrl = (await api.get("/s3url")).data.uploadUrl;

  console.log("bbbbbbbbbbbbbbbbbb");
  console.log(uploadUrl);
  const {
    config: { url },
  } = await api.put(uploadUrl, file, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: false,
  });

  return url;
};

export { updateProfile, getRetrieveUrl };
