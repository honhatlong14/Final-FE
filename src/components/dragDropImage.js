import React, {useState} from "react";
import {FileUploader} from "react-drag-drop-files";
import {updateUserImage} from "../apiServices";
import {connect} from "react-redux";
import {toast} from "react-toastify";

const fileTypes = ["JPG", "PNG", "GIF"];

function DragDropImage({authenticateReducer, className, ...rest}) {
    const [file, setFile] = useState(null);
    const {refreshToken, jwtToken, id} = authenticateReducer;
    let jwtTokenState = jwtToken;
    let refreshTokenState = refreshToken;
    const handleChange = async (file) => {
        setFile(file);
        const {data, status} = await updateUserImage(jwtTokenState, id, file)
        if (status === 200) {
            console.log(data)
        } else {
            toast.error(JSON.stringify(data.errors));
        }

    };

    return (
        <FileUploader handleChange={handleChange} name="file" types={fileTypes} classes={className}/>
    );
}

const mapStateToProps = (state) => {
    return {
        authenticateReducer: state.authenticateReducer
    };
};

export default connect(mapStateToProps)(DragDropImage);