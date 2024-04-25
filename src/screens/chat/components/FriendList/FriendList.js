import React, {useRef} from "react";
import {connect, useDispatch} from "react-redux";
import Friend from "../Friend/Friend";
import { setCurrentChat } from "../../../../store/actions/chatAction";
import "./FriendList.css";
import { useSelector } from "react-redux";
import {getNewToken, getNewTokenSuccess, logoutSuccess} from "../../../../store/actions/authenticateAction";
import {
  createChat,
  refreshToken as refreshTokenApi,
  tokenRequestInterceptor
} from "../../../../apiServices";
import {toast} from "react-toastify";

const FriendList = ({authenticateReducer}) => {
  const {jwtToken} = useSelector((state) => state.authenticateReducer);
  const jwtTokenState = useRef(jwtToken);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authenticateReducer);
  const chats = useSelector((state) => state.chat.chats);
  const socket = useSelector((state) => state.chat.socket);

  const openChat = (chat) => {
    dispatch(setCurrentChat(chat));
  };

  const addNewFriend = async (id) => {
    const createChatData = async () => {
      const {data, status} = await createChat(jwtTokenState.current, id);
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

    const {data, status} = await tokenRequestInterceptor(createChatData, getRefreshToken);
    if (status === 200) {
      socket.invoke("AddFriend", { chats: data });
    } else if (status === 401) {
      toast.error(data.message);
    } else {
      toast.error(JSON.stringify(data.errors));
    }
  };

  return (
    <div id="friends" className="shadow-light">
      <div style={{paddingBottom:'10px',borderBottom: "1px solid black"}}>
        <div id="title" style={{marginTop:'10px', display:'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h3 className="text-xl font-bold" style={{marginTop:'10px', display:'flex', justifyContent: 'center', alignItems: 'center'}}>Staff</h3>
          <button onClick={() => addNewFriend(user.id)} style={{textAlign: 'center'}}>
            <span style={{textAlign: 'center'}}>Start</span>
          </button>
        </div>
      </div>

      <div id="friends-box">
        {chats.length > 0 ? (
          chats.map((chat, i) => {
            return (
              <Friend click={() => openChat(chat)} chat={chat} key={i} />
            );
          })
        ) : (
          <p id="no-chat">No Staff added</p>
        )}
      </div>
    </div>
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


export default connect(mapDispatchToProps, mapStateToProps)(FriendList);
