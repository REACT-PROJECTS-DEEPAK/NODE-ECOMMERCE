import axios from "axios";
import {
  ALL_PRODUCTS_REQUEST,
  ALL_PRODUCTS_SUCCESS,
  ALL_PRODUCTS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  CLEAR_ERRORS,
} from "../Constants/productConstant";

// this will fetch all our products from backend.
//currentPage=1 mean by default page number is one
// once we set they keyword and fetched data with network request. the  `/api/v1/products?keyword=${keyword}&page=${currentPage}` will hit backend with keyword
// --where we defined a route with keyword searching and we getback our data with searched keyword.
// add parameter price to the array function its and array so values will be price[0] and price[1]
export const getProducts =
  (keyword = "", currentPage, price, category, rating = 0) =>
  async (dispatch) => {
    try {
      dispatch({ type: ALL_PRODUCTS_REQUEST }); // first we dispatch the action so that all the previous products are cleared out & loading is set to true.
      //after this we should send the request to backend to get data.
      // const { data } = await axios.get("/api/v1/products");
      // to adujust code to receive current page data from backend
      // why we gave page-... because at backend we customized querry as this.queryStr.page)
      // modify the get method by including keyword which comes from search product
      // console.log(keyword);
      // create a link for the api url. Here price should be greater than 0 and must be less than 1000 doller
      let link = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[lte]=${price[1]}&price[gte]=${price[0]}&ratings[gte]=${rating}`;
      // we check if category exist then send link with category to backend if not exist dont send it.
      if (category) {
        link = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[lte]=${price[1]}&price[gte]=${price[0]}&category=${category}&ratings[gte]=${rating}`;
      }
      const { data } = await axios.get(link);
      // console.log(data);
      //after pulling data dispath the action
      //once after firing network request we get our data in data . this data we are linking to payload
      // now when we dispatch the action with data. this goes in reducer. so here the action = { type: ALL_PRODUCTS_SUCCESS,payload: data,  }

      dispatch({
        type: ALL_PRODUCTS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      // if there is an error this action will get dispatched which is linked to ALL_PRODUCTS_FAIL reducer of product reducer.
      dispatch({
        type: ALL_PRODUCTS_FAIL,
        payload: error.response.data.message, // here what ever failed response we got we are linking to error object of ALL PRODCUT FAIL reducer.
      });
    }
  };

// this will fetch all our productsDetails from backend.
export const getProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST }); // first we dispatch the action so that all the previous products are cleared out & loading is set to true.
    //after this we should send the request to backend to get data.
    const { data } = await axios.get(`/api/v1/product/${id}`);
    // console.log(data);
    //after pulling data dispath the action
    //once after firing network request we get our data in data . this data we are linking to payload
    // now when we dispatch the action with data. this goes in reducer. so here the action = { type: ALL_PRODUCTS_SUCCESS,payload: data,  }

    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data.product,
    });
  } catch (error) {
    // if there is an error this action will get dispatched which is linked to ALL_PRODUCTS_FAIL reducer of product reducer.
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: error.response.data.message, // here what ever failed response we got we are linking to error object of ALL PRODCUT FAIL reducer.
    });
  }
};

// to clear error.
export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};
