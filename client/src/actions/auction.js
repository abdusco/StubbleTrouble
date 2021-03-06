import axios from "axios";
import {
    AUCTION_LIST_REQUEST,
    AUCTION_LIST_SUCCESS,
    AUCTION_LIST_FAILURE,
    AUCTION_REQUEST,
    AUCTION_SUCCESS,
    AUCTION_FAILURE,
    AUCTION_ADD_REQUEST,
    AUCTION_ADD_SUCCESS,
    AUCTION_ADD_FAILURE,
    AUCTION_EDIT_REQUEST,
    AUCTION_EDIT_SUCCESS,
    AUCTION_EDIT_FAILURE,
    AUCTION_DELETE_REQUEST,
    AUCTION_DELETE_SUCCESS,
    AUCTION_DELETE_FAILURE,
} from "./types";

// import setAuthToken from "../utils/setAuthToken";

// Get Auctions
export const getAuctionList = () => async (dispatch) => {
    dispatch({
        type: AUCTION_LIST_REQUEST,
    });
    try {
        const res = await axios.get("/api/auctions");
        dispatch({
            type: AUCTION_LIST_SUCCESS,
            payload: res.data,
        });
    } catch (err) {
        const errors = err.response.data.errors;
        console.log(errors);
        dispatch({
            type: AUCTION_LIST_FAILURE,
        });
    }
};

// Get Auction
export const getAuction = (id) => async (dispatch) => {
    dispatch({
        type: AUCTION_REQUEST,
    });
    try {
        const res = await axios.get(`/api/auctions/${id}`);
        dispatch({
            type: AUCTION_SUCCESS,
            payload: res.data,
        });
    } catch (err) {
        const errors = err.response.data.errors;
        console.log(errors);
        dispatch({
            type: AUCTION_FAILURE,
        });
    }
};

// Add auction
export const addAuction = (auctionDetail) => async (dispatch) => {
    const {
        area,
        location: { lat, long },
        address,
    } = auctionDetail;
    dispatch({
        type: AUCTION_ADD_REQUEST,
    });
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };
    const body = JSON.stringify({ area, lat, long, address });
    console.log(lat);
    try {
        const res = await axios.post("/api/auctions", body, config);
        dispatch({
            type: AUCTION_ADD_SUCCESS,
            payload: res.data,
        });
    } catch (err) {
        const errors = err.response.data.errors;
        console.log(errors);
        dispatch({
            type: AUCTION_ADD_FAILURE,
        });
    }
};

// Edit Auction
export const editAuction = (id, newAuctionDetail) => async (dispatch) => {
    const {
        area,
        location: { lat, long },
        address,
    } = newAuctionDetail;
    dispatch({
        type: AUCTION_EDIT_REQUEST,
    });
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    const body = JSON.stringify({ area, lat, long, address });
    try {
        const res = await axios.put(`/api/auctions/${id}`, body, config);
        dispatch({
            type: AUCTION_EDIT_SUCCESS,
            payload: res.data,
        });
    } catch (err) {
        const errors = err.response.data.errors;
        console.log(errors);
        dispatch({
            type: AUCTION_EDIT_FAILURE,
        });
    }
};

// Delete Auction
export const deleteAuction = (id) => async (dispatch) => {
    dispatch({
        type: AUCTION_DELETE_REQUEST,
    });

    try {
        // const res =
        await axios.delete(`/api/auctions/${id}`);
        dispatch({
            type: AUCTION_DELETE_SUCCESS,
            payload: id,
        });
    } catch (err) {
        const errors = err.response.data.errors;
        console.log(errors);
        dispatch({
            type: AUCTION_DELETE_FAILURE,
        });
    }
};
