import React, {Fragment, useRef, useState} from "react";
import { userStatus } from "../../utility/chatHelper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ChatHeader.css";
import {connect, useDispatch, useSelector} from "react-redux";
import {faEllipsisVertical, faTrash} from "@fortawesome/free-solid-svg-icons";
import {
    deleteCurrentChat,
    refreshToken as refreshTokenApi,
    tokenRequestInterceptor
} from "../../../../apiServices";
import {getNewToken, getNewTokenSuccess, logoutSuccess} from "../../../../store/actions/authenticateAction";
import {toast} from "react-toastify";

const ChatHeader = ({authenticateReducer, chat }) => {
    const {jwtToken} = useSelector((state) => state.authenticateReducer);
    const jwtTokenState = useRef(jwtToken);
    const [showChatOptions, setShowChatOptions] = useState(false);
    const dispatch = useDispatch();

    const socket = useSelector((state) => state.chat.socket);

  const deleteChat = async () => {
      const deleteChatData = async () => {
          const {data, status} = await deleteCurrentChat(jwtTokenState.current, chat.id);
          return {data, status}
      }

      const getRefreshToken = async () => {
          const {data, status} = await refreshTokenApi(jwtTokenState.current);
          if (status === 200) {
              jwtTokenState.current = data.jwtToken;
              dispatch(getNewTokenSuccess(data));
          } else {
              dispatch(logoutSuccess());
          }
      };

      const {data, status} = await tokenRequestInterceptor(deleteChatData, getRefreshToken);
      if (status === 200) {
          socket.invoke("DeleteChat", data);
      } else if (status === 401) {
          toast.error(data.message);
      } else {
          toast.error(JSON.stringify(data.errors));
      }
  };

  return (
    <Fragment>
      <div id="chatter">
        {chat.users.map((user) => {
          return (
            <div className="chatter-info" key={user.id}>
              <h3 className="font-bold" style={{fontSize:'20px', fontWeight:'bold'}}>
                {user.fullName}
              </h3>
              <div className="chatter-status">
                <span className={`online-status ${userStatus(user)}`}></span>
              </div>
            </div>
          );
        })}
      </div>
      <FontAwesomeIcon
        onClick={() => setShowChatOptions(!showChatOptions)}
        icon={faEllipsisVertical}
        className="fa-icon"
      />
      {showChatOptions ? (
        <div id="settings">
          {chat.type === "dual" ? (
            <div onClick={() => deleteChat()}>
              <FontAwesomeIcon icon={faTrash} className="fa-icon" />
              <p>Delete chat</p>
            </div>
          ) : null}
        </div>
      ) : null}
    </Fragment>
  );
};

const mapDispatchToProps = (dispatch) => {
    return {
        getNewToken: (token) => dispatch(getNewToken(token))
    }
}
const mapStateToProps = (state) => {
    return {
        authenticateReducer: state.authenticateReducer,
    };
};

export default connect(mapDispatchToProps, mapStateToProps)(ChatHeader);
