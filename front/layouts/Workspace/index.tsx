import fetcher from "@utils/fetcher";
import axios from "axios";
import React, { FC, useCallback } from "react";
import { Navigate, Routes, Route } from "react-router";
import useSWR from "swr";
import {
  Channels,
  Chats,
  Header,
  MenuScroll,
  ProfileImg,
  RightMenu,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from "./styles";
import gravatar from "gravatar";
import loadable from "@loadable/component";

const Channel = loadable(() => import("@pages/Channel"));
const DirectMessage = loadable(() => import("@pages/DirectMessage"));

const Workspace: FC = ({ children }) => {
  const { data, error, mutate } = useSWR("http://localhost:3095/api/users", fetcher);
  const onLogout = useCallback(() => {
    axios
      .post("http://localhost:3095/api/users/logout", null, {
        withCredentials: true,
      })
      .then(() => mutate());
  }, []);

  if (!data) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <span>
            <ProfileImg src={gravatar.url(data.nickname, { s: "28px", d: "ratro" })} alt={data.nickname} />
          </span>
        </RightMenu>
      </Header>
      <button onClick={onLogout}>로그아웃</button>
      <WorkspaceWrapper>
        <Workspaces>test</Workspaces>
        <Channels>
          <WorkspaceName>Slack</WorkspaceName>
          <MenuScroll>menu scroll</MenuScroll>
        </Channels>
        <Chats></Chats>
      </WorkspaceWrapper>
      <Chats>
        <Routes>
          <Route path="channel" element={<Channel />} />
          <Route path="dm" element={<DirectMessage />} />
          <Route path="*" element={<div>no match</div>} />
        </Routes>
      </Chats>
      {children}
    </div>
  );
};

export default Workspace;
