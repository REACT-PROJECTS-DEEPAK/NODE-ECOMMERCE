import {
  ALL_PRODUCTS_REQUEST,
  ALL_PRODUCTS_SUCCESS,
  ALL_PRODUCTS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  CLEAR_ERRORS,
} from "../Constants/productConstant";

// constains states initially it shouldbe empty array and state is an object so object contain empty array
// what ever object we kept in dispatch funciton of product action that will come to action parameter.
export const productsReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case ALL_PRODUCTS_REQUEST: // this case we set loading to true and products array should be initialised to empty arry
      return {
        loading: true,
        products: [],
      };
    case ALL_PRODUCTS_SUCCESS: // this case we set loading to false and products array should contain all the products fetched from backend and all products loaded successfully.
      //console.log(state.products);
      // console.log(action.payload);
      return {
        loading: false,
        products: action.payload.products, // here products is value which is on left hand side so we set to fetched products.
        productCount: action.payload.productCount,
        resPerPage: action.payload.resultsperPage,
        filteredProductsCount: action.payload.filteredProductsCount, // linking from backend api data.
      };
    // in above step what ever data we are sending from backend they should tagged to action keyword.
    // so if anything we see like action.payload.products that is data fetched from backend.LHS is our state object in react.
    case ALL_PRODUCTS_FAIL: // this case we set loading to true and products array should be initialised to empty arry
      return {
        loading: false,
        error: action.payload, // from the action this value get populated and we display it on screen.
      };
    case CLEAR_ERRORS: // this case we set loading to true and products array should be initialised to empty arry
      return {
        ...state,
        error: null,
      };
    // here above step we clear our error.
    default:
      return state;
  }
};

// this code is to display product details once after clicking the view product.

// product by default is empty object in state
export const productDetailsReducer = (state = { product: {} }, action) => {
  switch (action.type) {
    case PRODUCT_DETAILS_REQUEST:
      return { ...state, loading: true };
    case PRODUCT_DETAILS_SUCCESS:
      // console.log(action);
      return { loading: false, product: action.payload };
    case PRODUCT_DETAILS_FAIL:
      return { ...state, error: action.payload };
    case CLEAR_ERRORS: // this case we set loading to true and products array should be initialised to empty arry
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
