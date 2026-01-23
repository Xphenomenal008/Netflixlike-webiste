import axios from "axios";
import { ENV_VARS } from "../config/envVar.js";

export const FetchfromTMDB = async (url) => {
  console.log("TMDB TOKEN LENGTH:", ENV_VARS.TMDB_TOKEN?.length);

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${ENV_VARS.TMDB_TOKEN}`,
        accept: "application/json",
      },
      timeout: 15000,
    });

    return response.data;
  } catch (error) {
    console.error("error", error.message);
    throw error;
  }
};
