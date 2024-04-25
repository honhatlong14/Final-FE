import ProfileLayout from "../../../../layout/ProfileLayout";
import {useFormik} from "formik";
import * as yup from "yup";
import {Button, Input} from "@material-tailwind/react";
import {Loading} from "../../../../components/loading";
import React, {useRef, useState} from "react";
import {getNewToken} from "../../../../store/actions/authenticateAction";
import {connect} from "react-redux";
import {createAddress, createBookPost} from "../../../../apiServices";
import {toast} from "react-toastify";


const CreateAddressFormValidationSchema = yup.object({
    streetNumber: yup.string().max(255).required('Title cannot be empty.'),
    streetName: yup
        .string()
        .required('Description cannot be empty.'),
    city: yup
        .string()
        .required('Description cannot be empty.'),
    country: yup
        .string()
        .required('Description cannot be empty.'),
});
const CreateAddressPage = ({getNewTokenRequest, authenticateReducer}) => {
    const {jwtToken, id} = authenticateReducer;
    const [loading, setLoading] = useState(false)
    const jwtTokenState = useRef(jwtToken);

    const formik = useFormik({
        initialValues: {
            streetNumber: '',
            streetName: '',
            city: '',
            country: '',
            userId: id,
            addressStatus: 0

        }, validationSchema: CreateAddressFormValidationSchema,
        onSubmit: async (value) => {
            setLoading(true);
            setTimeout(async () => {
                const {data, status} = await createAddress(jwtTokenState.current, value)
                if (status === 200) {
                    toast.success(data.message);
                    setLoading(false);
                    setTimeout(() => {
                        window.location.reload();
                    }, 500 )
                } else {
                    toast.error(data.message);
                    setLoading(false);
                }

            }, 1000);

        },
    });

    return (
        <>
            <ProfileLayout>
                <div
                    className='w-full bg-cover bg-no-repeat bg-opacity-50 px-10 py-2'
                >
                    <div className='py-6'>
                        <h1>Create Address</h1>
                    </div>
                    <form
                        onSubmit={formik.handleSubmit}
                    >
                        <div className='flex flex-col '>

                            <div className='flex mb-3'>
                                <div className='mx-5 basis-[144px] w-[144px]'>
                                    Street Number
                                </div>
                                <div className='flex-auto'>
                                    {formik.errors.streetNumber && formik.touched.streetNumber ? (
                                        <Input size="md" className=''
                                               name='streetNumber'
                                               onChange={formik.handleChange}
                                               value={formik.values.streetNumber}
                                               label={formik.errors.streetNumber}
                                               error
                                        />
                                    ) : <Input variant="outlined" size="md" label="Street Number" className=''
                                               name='streetNumber'
                                               onChange={formik.handleChange}
                                               value={formik.values.streetNumber}
                                    />}
                                </div>

                            </div>


                            <div className='flex mb-3'>
                                <div className='mx-5 basis-[144px] w-[144px]'>
                                    Street Name
                                </div>
                                <div className='flex-auto'>
                                    {formik.errors.streetName && formik.touched.streetName ? (
                                        <Input size="md" className=''
                                               name='streetName'
                                               onChange={formik.handleChange}
                                               value={formik.values.streetName}
                                               label={formik.errors.streetName}
                                               error
                                        />
                                    ) : <Input variant="outlined" size="md" label="Street Name" className=''
                                               name='streetName'
                                               onChange={formik.handleChange}
                                               value={formik.values.streetName}
                                    />}
                                </div>
                            </div>

                            <div className='flex mb-3'>
                                <div className='mx-5 basis-[144px] w-[144px]'>
                                    City
                                </div>
                                <div className='flex-auto'>
                                    {formik.errors.city && formik.touched.city ? (
                                        <Input variant="outlined" size="md" className=''
                                               name='city'
                                               onChange={formik.handleChange}
                                               value={formik.values.city}
                                               label={formik.errors.city}
                                               error
                                        />
                                    ) : <Input size="md" label="City" className=''
                                               name='city'
                                               onChange={formik.handleChange}
                                               value={formik.values.city}
                                    />}
                                </div>
                            </div>
                            <div className='flex mb-3'>
                                <div className='mx-5 basis-[144px] w-[144px]'>
                                    Country
                                </div>
                                <div className='flex-auto'>
                                    {formik.errors.country && formik.touched.country ? (
                                        <Input size="md" className=''
                                               name='country'
                                               onChange={formik.handleChange}
                                               value={formik.values.country}
                                               label={formik.errors.country}
                                               error
                                        />
                                    ) : <Input variant="outlined" size="md" label="Author book" className=''
                                               name='country'
                                               onChange={formik.handleChange}
                                               value={formik.values.country}
                                    />}
                                </div>
                            </div>


                            <div className='mx-auto'>
                                {loading ? <Loading className='mt-3 '/> : <Button type='submit' >Saved Change</Button>}
                            </div>
                        </div>
                    </form>
                </div>
            </ProfileLayout>

        </>
    )
}

const mapStateToProps = (state) => {
    return {
        authenticateReducer: state.authenticateReducer,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getNewTokenRequest: (jwtToken) => dispatch(getNewToken(jwtToken)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateAddressPage)