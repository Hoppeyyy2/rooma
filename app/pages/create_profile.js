import Head from "next/head";
import styled from "styled-components";
import * as React from "react";
import Tutorial from "../comps/Tutorial";
import { useState } from "react";
import NewProfile from "../comps/NewProfile";
import { requireAuthen } from "../api/require.authen";
import { demoUser, isDemoMode } from "../config/demo.config";

const MainCont = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`;

const LeftCont = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: #f6f6fe;
  justify-content: center;
`;
const LogoCont = styled.img`
  width: 100px;
  margin: 30px 50px;
  position: absolute;
  top: 10px;
`;
const RightCont = styled.div`
  display: flex;
  flex: 1;
`;

export default function CreateProfile(props) {

  return (
    <MainCont>
      <LeftCont>

        <LogoCont src="/Mainlogo.png" />

        <Tutorial
          animation="/create_profile.png"
          chead="Create"
          bhead="Profile"
          para="Create your personal profile to share with your roommates!"
          aniwidth="550px"
          buttoncolor1="#724FE9"
          buttoncolor2="#DADADA"
          buttoncolor3="#DADADA"
          buttoncolor4="#DADADA"
          buttondisplay="none"
        />
      </LeftCont>

      <RightCont>
        <NewProfile user={props.auth.user} />
      </RightCont>
    </MainCont>
  );
}

export const getServerSideProps = async (context) => {
  if (isDemoMode) {
    return { props: { auth: { user: demoUser } } };
  }

  let authProp = await requireAuthen(context, false);
  if (!authProp.hasOwnProperty("user")) {
    return { redirect: authProp };
  } else {
    return {
      props: {
        auth: authProp
        // events: Math.random(),
      },
    };
  }
  // return requireAuthen(context);
};
