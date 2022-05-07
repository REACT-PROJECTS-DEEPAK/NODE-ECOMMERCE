import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
  CLEAR_ERRORS,
} from "../Constants/userConstants";
import axios from "axios";

//login data
export const login = (email, password) => async (dispatch) => {
  try {
    // console.log(email);
    dispatch({ type: LOGIN_REQUEST });
    // her we are setting heards.
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(
      "/api/v1/login",
      { email, password },
      config
    );
    // console.log(data);
    dispatch({ type: LOGIN_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
      payload: error.response.data.message,
    });
  }
};

//REGISTER USER
export const register = (userData) => async (dispatch) => {
  try {
    console.log(userData.get("avatar"));
    dispatch({ type: REGISTER_USER_REQUEST });
    // her we are setting heards.
    const config = {
      headers: {
        "content-type": "multipart/form-data", // here we are passing images as well so we should use multipart form data.
      },
    };
    // const { data } = await axios.post("/api/v1/register", { userData }, config);
    // const { data } = await axios.post(
    //   `/api/v1/register`,
    //   userData,

    //   { config }
    // );
    const { data } = await axios.post(`/api/v1/register`, userData, config);
    console.log(data);
    dispatch({ type: REGISTER_USER_SUCCESS, payload: data.user });
  } catch (error) {
    console.log(error.response.data);
    console.log(error.response.data.stack);
    dispatch({
      type: REGISTER_USER_FAIL,
      payload: error.response.data.errMessage,
    });
  }
};
// to clear error.
export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};
