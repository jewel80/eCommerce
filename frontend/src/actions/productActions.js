import axios from 'axios';
import {
    ALL_PRODUCTS_FAIL, ALL_PRODUCTS_REQUEST,
    ALL_PRODUCTS_SUCCESS, CLEAR_ERRORS, PRODUCT_DETAILS_FAIL, PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS
} from '../constants/productConstants';


export const getProducts =
  (currentPage = 1) =>
  async (dispatch) => {
    try {
      dispatch({ type: ALL_PRODUCTS_REQUEST });

      const { data } = await axios.get(`/api/v1/products?page=${currentPage}`);

      dispatch({
        type: ALL_PRODUCTS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ALL_PRODUCTS_FAIL,
        payload: error.response.data.message,
      });
    }
  };

export const getProductDetails = (id) => async(dispatch) => {
    try {
        dispatch({ type: PRODUCT_DETAILS_REQUEST })

        const { data } = await axios.get(`/api/v1/product/${id}`)

        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data.product
        })

    } catch (error) {
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: error.response.data.message
        })
    }
}

//Clear Erros
export const clearErrors = () => async(dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    })
}