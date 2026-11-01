import api from "./axios";
import axios from "axios";
import router from "next/router";
import { server_api } from "../config/env.config";
import { requestDemoApi } from "./demo.api";
import { isDemoMode } from "../config/demo.config";

export const requireAuthen = async (ctx, RoomRedirect = false) => {

  // using cookie to request a user
  const response = await api({
    method: "get",
    url: "/auth/authenticate",
    headers: ctx.req.headers.cookie
      ? { cookie: ctx.req.headers.cookie }
      : undefined,
  });

  console.log('11111 require Authennnn response');
  console.log(response);

  // const response = await axios
  //   .get(`${server_api}auth/authenticate`, {
  //     withCredentials: true,
  //   })
  //   .then((response) => {
  //     console.log("eeeeeeeeeeeeeeeeeeeeee");
  //     console.log(response);
  //     return response;
  //   })
  //   .catch((error) => {
  //     console.log("xxxxxxxxxxxxxxxxxxxxxx");
  //     // console.log(error);
  //     console.log(error.response);
  //     console.log("88888888888888888888");
  //     console.log(error.response.data);
  //   });

  // user not found back to login page
  if (response.status != 200) {
    console.log('2222222 require Authennnn USER NOT FOUND ==> Login');
    // return {
    //   redirect: {
    //     destination: "/login",
    //     permanent: false,
    //   },
    // };
    return {
      destination: "/login",
      permanent: false,
    };
  }

  if (!response.data.roomId && RoomRedirect) {
    console.log('2222222 require Authennnn USER FOUND but no room ID ===> Join');

    // return {
    //   redirect: {
    //     destination: "/join",
    //     permanent: false,
    //   },
    // };
    return {
      destination: "/join",
      permanent: false,
    };
  }

  console.log('333333 all good proceed to home page.');

  // return {
  //   props: {
  //     user: response.data,
  //   },
  // };
  return { user: response.data };
};


export const requireAuthenCompo = async (cb) => {
  if (isDemoMode) {
    try {
      const response = requestDemoApi({
        method: "get",
        url: `${server_api}auth/authenticate`,
      });
      cb(null, response.data.user);
    } catch (error) {
      cb(error);
    }
    return;
  }

  console.log('requireAuthenCompo requireAuthenCompo');
  await axios
    .get(`${server_api}auth/authenticate`, {
      withCredentials: true,
    })
    .then((response) => {
      console.log("eeeeeeeeeeeeeeeeeeeeee");
      console.log(response);
      cb(null, response.data)
    })
    .catch((error) => {
      console.log("xxxxxxxxxxxxxxxxxxxxxx");
      console.log(error);
      cb(error);
    });

};

export const checkUser = () => {
  // using cookie to request a user
  console.log("checking user...");
  api({
    method: "get",
    url: "/user",
    withCredentials: true,
  }).then((response) => {
    if (response.status == 200) {
      console.log("USER already logged in");
      return router.push("/home");
    }
  });
};

export const login = (event) => {
  event.preventDefault();
  return api
    .post(
      "/auth/login",
      {
        email: event.target[0].value,
        password: event.target[1].value,
      },
      { withCredentials: true }
    )
    .then((response) => {
      if (response.status == 200) {
        return router.push("/home");
      }

      event.target.reset();
      return response.data.err;
    });
};

export const register = (event) => {
  event.preventDefault();
  return api
    .post(
      "/auth/register",
      {
        email: event.target[1].value,
        password: event.target[2].value,
        username: event.target[0].value,
      },
      { withCredentials: true }
    )
    .then((response) => {
      console.log(response.status);
      if (response.status == 200) {
        return router.push("/passport/signin");
      }

      event.target.reset();
      return response.data.err;
    });
};

export const logout = () => {
  console.log("logging out~!");
  api.get("/auth/logout").then((response) => {
    return router.push("/");
  });
};
