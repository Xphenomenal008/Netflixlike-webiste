import axios from "axios";
import { ENV_VARS } from "../config/envVar.js";
console.log(ENV_VARS.TMDB_API_KEY)

export const FetchfromTMDB = async (url) => {
    const options = {
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${ENV_VARS.TMDB_API_KEY}`, 
        },
    };

    try {
        const response = await axios.get(url, options);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch data from TMDB: ${error.response?.statusText || error.message}`);
    }
};
