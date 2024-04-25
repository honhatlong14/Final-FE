import React, {useEffect, useRef} from "react";
import {useSelector, useDispatch, connect} from "react-redux";
import FriendList from "./components/FriendList/FriendList";
import Messenger from "./components/Messenger/Messenger";
import "./Chat.css";
import {HubConnectionBuilder} from "@microsoft/signalr";
import {
    fetchChats,
    onlineFriends,
    onlineFriend,
    offlineFriend,
    setSocket,
    receivedMessage,
    senderTyping,
    createChat,
    addUserToGroup,
    leaveCurrentChat,
    deleteCurrentChat,
} from "../../store/actions/chatAction";
import {fetchChats as getChatApi, refreshToken as refreshTokenApi, tokenRequestInterceptor} from "../../apiServices";
import {getNewToken, getNewTokenSuccess, logoutSuccess} from "../../store/actions/authenticateAction";
import {toast} from "react-toastify";

const Chat = ({authenticateReducer}) => {

    const {jwtToken} = useSelector((state) => state.authenticateReducer);
    const jwtTokenState = useRef(jwtToken);
    const signalRUrl = process.env.REACT_APP_BASE_SIGNALR;
    const dispatch = useDispatch();
    const user = useSelector((state) => state.authenticateReducer);
    const chats = useSelector((state) => state.chat.chats);

    useEffect(() => {
        if (chats) {
            const connection = new HubConnectionBuilder()
                .withUrl(signalRUrl)
                .build();

            connection
                .start()
                .then(() => {
                    dispatch(setSocket(connection));
                    connection.invoke("Join", user);

                    connection.on("typing", (sender) => {
                        dispatch(senderTyping(sender));
                    });

                    connection.on("friends", (friends) => {
                        dispatch(onlineFriends(friends));
                    });

                    connection.on("online", (onlineUser) => {
                        dispatch(onlineFriend(onlineUser));
                    });

                    connection.on("offline", (offlineUser) => {
                        dispatch(offlineFriend(offlineUser));
                    });

                    connection.on("received", (message) => {
                        let payload = {
                            message,
                            userId: user.id,
                        };
                        dispatch(receivedMessage(payload));
                    });

                    connection.on("new-chat", (chat) => {
                        dispatch(createChat(chat));
                    });

                    connection.on("added-user-to-group", (group) => {
                        dispatch(addUserToGroup(group));
                    });

                    connection.on("remove-user-from-chat", (data) => {
                        data.currentUserId = user.id;
                        dispatch(leaveCurrentChat(data));
                    });

                    connection.on("delete-chat", (chatId) => {
                        dispatch(deleteCurrentChat(chatId));
                    });
                })
                .catch((err) => console.log(err));

            return () => {
                connection.stop();
            };
        }
    }, []);

    useEffect(() => {
        (async () => {
            const chatData = await getChats();
            dispatch(fetchChats(chatData));
        })();
    }, [dispatch, user]);

    const getChats = async () => {
        const fetchChatData = async () => {
            const {data, status} = await getChatApi(jwtTokenState.current);
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

        const {data, status} = await tokenRequestInterceptor(fetchChatData, getRefreshToken);
        if (status === 200) {
            return data;
        } else if (status === 401) {
            toast.error(data.message);
        } else {
            toast.error(JSON.stringify(data.errors));
        }
    };

    return (
        <div id="chat-container" style={{marginTop: '50px'}}>
            <div id="chat-wrap">
                <FriendList/>
                <Messenger/>
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

export default connect(mapDispatchToProps, mapStateToProps)(Chat);
