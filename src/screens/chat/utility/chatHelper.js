import {ChatStatus} from "../../../constants/chatStatus";
export const userStatus = (user) => {
    return user.status === ChatStatus.Online ? ChatStatus.Online : ChatStatus.Offline
}