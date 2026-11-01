import axios from "axios";
import { server_api } from "../config/env.config";
import api from "./axios";
import { requestDemoApi } from "./demo.api";
import { isDemoMode } from "../config/demo.config";

const serverCrash =
  "Wow the server MAY have crashed...be a hero, and tell Hailey, Jason or Sean ASAP. Please also remember the steps leading to this.";

const createRoom = (room_obj, cb) => {
  if (isDemoMode) {
    try {
      cb(null, requestDemoApi({
        method: "post",
        url: `${server_api}room/create`,
        data: room_obj,
      }));
    } catch (error) {
      cb(error);
    }
    return;
  }

  axios
    .post(`${server_api}room/create`, room_obj, {
      withCredentials: true,
    })
    .then((response) => {
      console.log("createRoom response");
      console.log(response);
      cb(null, response);
    })
    .catch((error) => {
      console.log("createRoom error");
      console.log(error);
      console.log(error.response);
      console.log(error.response.data);

      if (!error.response) {
        cb(new Error(serverCrash));
      } else {
        cb(
          "Room creation failed, please check your credential, or contact Hailey, Jason or Sean"
        );
      }
    });
};

const getCode = async (cb) => {
  if (isDemoMode) {
    try {
      cb(null, requestDemoApi({
        method: "get",
        url: `${server_api}room/invcode`,
      }));
    } catch (error) {
      cb(error);
    }
    return;
  }

  axios
    .get(`${server_api}room/invcode`, {
      withCredentials: true,
    })
    .then((response) => {
      console.log("getCode response");
      console.log(response);
      cb(null, response);
    })
    .catch((error) => {
      console.log("getCode error");
      console.log(error);
      if (!error.response) {
        cb(new Error(serverCrash));
      } else {
        cb(error.response.data);
      }
    });
};

const getRoomates = async (ctx) => {
  console.log("getRoomates getRoomates getRoomates");

  const response = await api({
    method: "get",
    url: "/user/roommates",
    headers: ctx.req.headers.cookie
      ? { cookie: ctx.req.headers.cookie }
      : undefined,
  });

  console.log("666666666666666666");
  console.log(response.data.roommates);

  if (response.status != 200) {
    console.log("aaaaaaaaaaaaaaaaaaaaaaaa");
    return {
      props: {
        users: [],
      },
    };
  }

  return {
    props: {
      users: response.data.roommates,
    },
  };

  // await axios
  //   .get(`${server_api}user/roommates`, {
  //     withCredentials: true,
  //   })
  //   .then((response) => {
  //     console.log("getRoomates response");
  //     console.log(response);
  //     cb(null, response);
  //   })
  //   .catch((error) => {
  //     console.log("getRoomates error");
  //     console.log(error);
  //     if (!error.response) {
  //       cb(new Error(serverCrash));
  //     } else {
  //       cb(error.response.data);
  //     }
  //   });
};

const leaveRoom = async (cb) => {
  if (isDemoMode) {
    try {
      cb(null, requestDemoApi({
        method: "patch",
        url: `${server_api}room/leave`,
        data: {},
      }));
    } catch (error) {
      cb(error);
    }
    return;
  }

  axios
    .patch(
      `${server_api}room/leave`,
      {},
      {
        withCredentials: true,
      }
    )
    .then((response) => {
      console.log("patch leaveRoom response");
      console.log(response);
      cb(null, response);
    })
    .catch((error) => {
      console.log("patch leaveRoom error");
      console.log(error);
      console.log(error.response);
      console.log(error.response.data);

      if (!error.response) {
        cb(new Error(serverCrash));
      } else {
        cb(
          "Leave room failed, please check your invite code, or contact Hailey, Jason or Sean"
        );
      }
    });
};

const joinRoom = async (room_obj, cb) => {
  if (isDemoMode) {
    try {
      cb(null, requestDemoApi({
        method: "patch",
        url: `${server_api}room/join`,
        data: room_obj,
      }));
    } catch (error) {
      cb(error);
    }
    return;
  }

  axios
    .patch(`${server_api}room/join`, room_obj, {
      withCredentials: true,
    })
    .then((response) => {
      console.log("patch joinRoom response");
      console.log(response);
      cb(null, response);
    })
    .catch((error) => {
      console.log("patch joinRoom error");
      console.log(error);
      console.log(error.response);
      console.log(error.response.data);

      if (!error.response) {
        cb(new Error(serverCrash));
      } else {
        cb(
          "Join room failed, please verify your invite code."
        );
      }
    });
};

export { createRoom, joinRoom, getCode, leaveRoom, getRoomates };
