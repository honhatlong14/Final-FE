import React, { useEffect, useRef, useState } from "react";
import {connect, useDispatch} from "react-redux";
import Message from "../Message/Message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./MessageBox.css";
import { useSelector } from "react-redux";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {paginateMessages} from "../../../../store/actions/chatAction";
import {getNewToken, getNewTokenSuccess, logoutSuccess} from "../../../../store/actions/authenticateAction";
import {paginateMessages as paginateMessagesApi, refreshToken as refreshTokenApi, tokenRequestInterceptor} from "../../../../apiServices";
import {toast} from "react-toastify";

const MessageBox = ({authenticateReducer, chat }) => {
  const {jwtToken} = useSelector((state) => state.authenticateReducer);
  const jwtTokenState = useRef(jwtToken);
  const dispatch = useDispatch();

  const user = useSelector((state) => state.authenticateReducer);
  const scrollBottom = useSelector((state) => state.chat.scrollBottom);
  const senderTyping = useSelector((state) => state.chat.senderTyping);
  const [loading, setLoading] = useState(false);
  const [scrollUp, setScrollUp] = useState(0);

  const msgBox = useRef();

  const scrollManual = (value) => {
    msgBox.current.scrollTop = value;
  };

  const handleInfiniteScroll = async (e) => {
    if (e.target.scrollTop === 0) {
      setLoading(true);
      const pagination = chat.Pagination;
      const page = typeof pagination === "undefined" ? 1 : pagination.page;

      const paginateMessagesData = async () => {
        const {data, status} = await paginateMessagesApi(jwtTokenState.current, chat.id,parseInt(page) + 1);
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

      const {data, status} = await tokenRequestInterceptor(paginateMessagesData, getRefreshToken);
      if (status === 200) {
        const { messages, pagination } = data;
        if (typeof messages !== "undefined" && messages.length > 0) {
          dispatch(paginateMessages(chat.id,messages,pagination));
          setScrollUp(scrollUp + 1);
        }

        setLoading(false);
      } else if (status === 401) {
        toast.error(data.message);
      } else {
        toast.error(JSON.stringify(data.errors));
      }

    }
  };

  useEffect(() => {
    setTimeout(() => {
      scrollManual(Math.ceil(msgBox.current.scrollHeight * 0.1));
    }, 100);
  }, [scrollUp]);

  useEffect(() => {
    if (
      senderTyping.typing &&
      msgBox.current.scrollTop > msgBox.current.scrollHeight * 0.3
    ) {
      setTimeout(() => {
        scrollManual(msgBox.current.scrollHeight);
      }, 100);
    }
  }, [senderTyping]);

  useEffect(() => {
    if (!senderTyping.typing) {
      setTimeout(() => {
        scrollManual(msgBox.current.scrollHeight);
      }, 100);
    }
  }, [scrollBottom]);

  return (
    <div onScroll={handleInfiniteScroll} id="msg-box" ref={msgBox}>
      {loading ? (
        <p className="loader m-0">
          <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
        </p>
      ) : null}
      {chat.messages != null && chat.messages.map((message, index) => {
        return (
          <Message
            user={user}
            chat={chat}
            message={message}
            index={index}
            key={message.id}
          />
        );
      })}
      {senderTyping.typing && senderTyping.chatId === chat.id ? (
        <div className="message mt-5p">
          <div className="other-person">
            <p className="m-0">...</p>
          </div>
        </div>
      ) : null}
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

export default connect(mapDispatchToProps, mapStateToProps)(MessageBox);
