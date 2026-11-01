import Head from "next/head";
import Image from "next/image";
import styled from "styled-components";
import React from "react";
import NavBar3 from "../comps/NavBar3";
import Invite from "../comps/Invite";
import HouseRules from "../comps/HouseRules";
import ManageProfile from "../comps/ManageProfile";
import LeaveGroup from "../comps/LeaveGroup";
import LogOut from "../comps/LogOut";
import SettingNavCont from "../comps/SettingNavCont";
import { useState, useContext } from "react";
import api from "../api/axios";
import { globalContext } from "../store/globalContext";
import { useRouter } from "next/router";
import EditProfile from "../comps/EditProfile";
import { requireAuthen } from "../api/require.authen";
import LoadingSpinner from "../UI/LoadingSpinner";
import { demoUser, isDemoMode } from "../config/demo.config";

const Cont = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`;

const LeftCont = styled.div`
  display: flex;
  flex-direction: column;
  flex: 2;
  border-right: 1px #d6d6d6 solid;
  margin-left: 20px;

  padding-right: 20px;
`;
const SetNav = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
`;
const Holder = styled.div`
  display: flex;
  flex: 4;

  // justify-content: center;
  // align-items: center;
  // flex-direction:column;
  // margin-top:30px;
`;

const Title = styled.p`
  font-size: 35px;
  margin-left: -200px;
  font-weight: 700;
  color: #181135;
`;

const NavCont = styled.div`
  display: flex;
`;

export default function Home(props) {
  //setting navigation buttons: Right Cont change
  const [showRightCont, setShowRightCont] = useState(1);
  const { currentUser, setCurrentUser } = useContext(globalContext);
  const [Message, setMessage] = useState("");
  const [ErrMessage, setErrMessage] = useState("");
  const router = useRouter();
  const [onLinkClicked, setOnLinkClicked] = useState(false);

  const onSetErrMessage = (msg) => {
    setErrMessage(msg);
  };

  const onSetMessage = (msg) => {
    setMessage(msg);
  };

  const HandleClickRightCont1 = () => {
    setShowRightCont(1);
  };
  const HandleClickRightCont2 = () => {
    setShowRightCont(2);
  };
  const HandleClickRightCont3 = () => {
    setShowRightCont(3);
  };
  const HandleClickRightCont4 = () => {
    setShowRightCont(4);
  };
  const HandleClickRightCont5 = () => {
    setShowRightCont(5);
  };

  // setting navigation button: Color change
  const [buttonstate1, setButtonState1] = useState(0);
  const [buttonstate5, setButtonState5] = useState(0);
  const HandleClickButtonColor1 = () => {
    setButtonState1(1);
  };
  const HandleClickButtonColor2 = () => {
    setButtonState1(2);
  };
  const HandleClickButtonColor3 = () => {
    setButtonState1(3);
  };
  const HandleClickButtonColor4 = () => {
    setButtonState1(4);
  };
  const HandleClickButtonColor5 = () => {
    setButtonState1(5);
  };
  const GlobalNavClick = () => {
    if (buttonstate5 === 0) {
      setButtonState5(1);
    } else {
      setButtonState5(0);
    }
  };
  const [buttonstate6, setButtonState6] = useState(0);
  const NotificationClick = () => {
    if (buttonstate6 === 0) {
      setButtonState6(1);
      setButtonState7(0);
    } else {
      setButtonState6(0);
      setButtonState7(1);
    }
  };

  const [buttonstate7, setButtonState7] = useState(0);
  const BackClick = () => {
    if (buttonstate7 === 0) {
      setButtonState7(1);
      setButtonState6(0);
    } else {
      setButtonState7(0);
      setButtonState6(1);
    }
  };

  const onLinkClick = () => {
    setOnLinkClicked(true);
  };

  return (
    <Cont>
      <NavCont>
        <NavBar3 onLinkClick={onLinkClick} color6="#8867EB" src6="/Settings_Icon_Color.svg" />
      </NavCont>

      {onLinkClicked ? (
        <LoadingSpinner />
      ) : (
        <>
          <LeftCont>
            <SetNav>
              <Title className="ubuntu">Settings</Title>
              <SettingNavCont
                heading="Add a member"
                ps="Invite a new member"
                src="/Member.png"
                onClick={() => {
                  HandleClickButtonColor1();
                  HandleClickRightCont1();
                  onSetErrMessage("");
                  onSetMessage("");
                }}
                bgcolor={buttonstate1 === 1 ? "#FAFAFA" : "#FFFFFF"}
              />
              <SettingNavCont
                heading="House Rules"
                ps="Learn about house rules"
                src="/House.png"
                onClick={() => {
                  HandleClickButtonColor2();
                  HandleClickRightCont2();
                  onSetErrMessage("");
                  onSetMessage("");
                }}
                bgcolor={buttonstate1 === 2 ? "#FAFAFA" : "#FFFFFF"}
              />
              <SettingNavCont
                heading="Manage Profile"
                ps="Manage profile settings"
                src="/Test Account.png"
                onClick={() => {
                  HandleClickButtonColor3();
                  HandleClickRightCont3();
                  onSetErrMessage("");
                  onSetMessage("");
                }}
                bgcolor={buttonstate1 === 3 ? "#FAFAFA" : "#FFFFFF"}
              />
              <SettingNavCont
                heading="Leave group"
                ps="Leave and join a new group"
                src="/Export.png"
                onClick={() => {
                  HandleClickButtonColor4();
                  HandleClickRightCont4();
                  onSetErrMessage("");
                  onSetMessage("");
                }}
                bgcolor={buttonstate1 === 4 ? "#FAFAFA" : "#FFFFFF"}
              />
              <SettingNavCont
                heading="Log Out"
                ps="Log out from the account"
                src="/Exit.png"
                onClick={() => {
                  HandleClickButtonColor5();
                  HandleClickRightCont5();
                  onSetErrMessage("");
                  onSetMessage("");
                }}
                bgcolor={buttonstate1 === 5 ? "#FAFAFA" : "#FFFFFF"}
              />
            </SetNav>
          </LeftCont>
          <Holder>
            <Invite display={showRightCont === 1 ? "flex" : "none"}></Invite>
            <HouseRules
              display={showRightCont === 2 ? "flex" : "none"}
            ></HouseRules>
            {/* <ManageProfile
          display={showRightCont === 3 ? "flex" : "none"}
        ></ManageProfile> */}
            <EditProfile
              Message={Message}
              ErrMessage={ErrMessage}
              onSetErrMessage={onSetErrMessage}
              onSetMessage={onSetMessage}
              user={props.auth}
              display={showRightCont === 3 ? "flex" : "none"}
            ></EditProfile>
            <LeaveGroup
              display={showRightCont === 4 ? "flex" : "none"}
            ></LeaveGroup>
            <LogOut display={showRightCont === 5 ? "flex" : "none"}></LogOut>
          </Holder>
        </>
      )}
    </Cont>
  );
}

export const getServerSideProps = async (context) => {
  if (isDemoMode) {
    return { props: { auth: { user: demoUser } } };
  }

  // return requireAuthen(context);
  let authProp = await requireAuthen(context, true);

  if (!authProp.hasOwnProperty("user")) {
    return { redirect: authProp };
  } else {
    return {
      props: {
        auth: authProp,
        // events: Math.random(),
      },
    };
  }
};
