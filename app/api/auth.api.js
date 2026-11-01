import axios from "axios";
// import MOCK_URL from "../../constants/mock_server_url";
import { server_api } from "../config/env.config";
import { requestDemoApi } from "./demo.api";
import { isDemoMode } from "../config/demo.config";

const serverCrash =
  "Wow the server MAY have crashed...be a hero, and tell Hailey, Jason or Sean ASAP. Please also remember the steps leading to this.";

const logout = (cb) => {
  if (isDemoMode) {
    try {
      cb(null, requestDemoApi({
        method: "get",
        url: `${server_api}user/logout`,
      }));
    } catch (error) {
      cb(error);
    }
    return;
  }

  axios
    .get(`${server_api}user/logout`, {
      withCredentials: true,
    })
    .then((response) => {
      console.log("user logout response");
      console.log(response);
      cb(null, response);
    })
    .catch((error) => {
      console.log("user logout error");
      console.log(error);
      if (!error.response) {
        cb(new Error(serverCrash));
      } else {
        cb(error.response.data);
      }
    });
};

const loginUser = (user_obj, cb) => {
  if (isDemoMode) {
    try {
      cb(null, requestDemoApi({
        method: "post",
        url: `${server_api}auth/local`,
        data: user_obj,
      }));
    } catch (error) {
      cb(error);
    }
    return;
  }

  console.log("user login user_obj");
  console.log(user_obj);

  axios
    .post(`${server_api}auth/local`, user_obj, {
      withCredentials: true,
    })
    .then((response) => {
      console.log("user login response");
      console.log(response);
      cb(null, response);
    })
    .catch((error) => {
      console.log("user login error");
      console.log(error);
      if (!error.response) {
        cb(new Error(serverCrash));
      } else {
        cb(error.response.data);
      }
    });
  // cb(new Error("login user not found"));
};

const register = (user_obj, cb) => {
  if (isDemoMode) {
    try {
      cb(null, requestDemoApi({
        method: "post",
        url: `${server_api}auth/local/register`,
        data: user_obj,
      }));
    } catch (error) {
      cb(error);
    }
    return;
  }

  axios
    .post(`${server_api}auth/local/register`, user_obj)
    .then((response) => {
      console.log("post register response");
      console.log(response);
      cb(null, response);
    })
    .catch((error) => {
      console.log("post register error");
      console.log(error);
      console.log(error.response);
      console.log(error.response.data);

      if (!error.response) {
        cb(new Error(serverCrash));
      } else {
        cb(
          "Registration failed, please check your credential, or contact Hailey, Jason or Sean"
        );
      }
    });
};

export { register, loginUser, logout };
