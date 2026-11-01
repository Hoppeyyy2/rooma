import { useState, useContext } from "react";
import * as React from "react";
import Head from "next/head";
import styled from "styled-components";
import NavBar3 from "../comps/NavBar3";
import ChatNav from "../comps/ChatNav";
import User1 from "../comps/ChatComps/user1";
import User2 from "../comps/ChatComps/user2";
import Input from "../comps/ChatComps/input";
import { getRoomates } from "../api/room.api";
import { globalContext } from "../store/globalContext";
import { requireAuthen } from "../api/require.authen";
import ChatBox from "../comps/ChatComps/ChatBox";
import LoadingSpinner from "../UI/LoadingSpinner";
import { demoRoommates, demoUser, isDemoMode } from "../config/demo.config";

const MainCont = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`;

//left cont
const LeftCont = styled.div`
display: flex;
flex-direction: column;
flex:2;
border-right: 1px #D6D6D6 solid;
`;
const TopCont = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 40px 75px 0px 75px;
  align-items: center;
`;
const Heading = styled.div`
  font-size: 34px;
  font-weight: 700;
`;
const Icon = styled.img``;

//Chat Nav cont
const NavCont = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
`;

// Right Container

const RightCont = styled.div`
  display: flex;
  flex: 3;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: flex-end;
`;
const ChatCont1 = styled.div`
  display: flex;
  width: 100%;
`;
const ChatCont2 = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
`;

export default function Chat(props) {
  const {
    currentUser,
    setCurrentUser,
    currentError,
    setCurrentError,
    setCurrentMsg,
    currentMsg,
  } = useContext(globalContext);
  const [buttonstate5, setButtonState5] = useState(0);
  const [RightChatter, setRightChatter] = useState(props.chatters);
  const [YourMsgs, setYourMsgs] = useState(["Hello you"]);
  const [Selected, setSelected] = useState("0000");
  const [onLinkClicked, setOnLinkClicked] = useState(false);

  const HandleClickButtonColor = (clickId) => {
    setSelected(clickId);
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
  const [buttonstate1, setButtonState1] = useState(0);
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

  const onMsgSubmit = (e, Message) => {
    console.log(e);

    if (e.keyCode === 13) {
      e.preventDefault();
      setYourMsgs([...YourMsgs, Message]);
    }
  };

  const getChats = () => {
    const chat_list = props.chatters.map((chatter) => {
      if (chatter.id !== props.auth.user.id) {
        return (
          <ChatNav
            chatterInfo={[chatter]}
            user={props.auth.user}
            bgcolor={Selected === chatter.id ? "#FAFAFA" : "#FFFFFF"}
            onClick={() => {
              HandleClickButtonColor(chatter.id);
              setYourMsgs([`Hello ${chatter.name}`]);
              setRightChatter([chatter]);
            }}
          />
        );
      }
    });
    return chat_list;
  };

  const onLinkClick = () => {
    setOnLinkClicked(true);
  };

  return (
    <MainCont>
      <NavBar3 onLinkClick={onLinkClick} color3 = "#8867EB"  src3 = "/Chat_Icon_Color.svg"/>

      {onLinkClicked ? (
        <LoadingSpinner />
      ) : (
        <>
          <LeftCont>
            <TopCont>
              <Heading className="ubuntu">Chat</Heading>
            </TopCont>

            <NavCont>
              <ChatNav
                chatterInfo={props.chatters}
                bgcolor={Selected === "0000" ? "#FAFAFA" : "#FFFFFF"}
                user={props.auth.user}
                onClick={() => {
                  HandleClickButtonColor("0000");
                  setYourMsgs([`Hello y'all`]);
                  setRightChatter(props.chatters);
                }}
              />
              {getChats()}
            </NavCont>
          </LeftCont>

          {/* Right Container */}
          <ChatBox
            user={props.auth.user}
            RightChatter={RightChatter}
            YourMsgs={YourMsgs}
            onMsgSubmit={(e, msg) => onMsgSubmit(e, msg)}
          />
        </>
      )}
      {/* <RightCont>
        <ChatCont1>
          <User1></User1>
        </ChatCont1>

        <ChatCont2>
          <User2></User2>
        </ChatCont2>

        <Input></Input>
      </RightCont> */}
    </MainCont>
  );
}

export const getServerSideProps = async (ctx) => {
  if (isDemoMode) {
    return {
      props: {
        auth: { user: demoUser },
        chatters: demoRoommates,
      },
    };
  }

  let authProp = await requireAuthen(ctx, true);

  if (!authProp.hasOwnProperty("user")) {
    return { redirect: authProp };
  } else {
    let chatters = await getRoomates(ctx);
    return {
      props: {
        auth: authProp,
        chatters: chatters.props.users,
      },
    };
  }
};
