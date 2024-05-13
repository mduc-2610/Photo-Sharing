/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url      The URL to issue the GET request.
 *EZ
 */
import { BASE_URL } from "../utils/constants";

export async function fetchModel(endpoint, id = null) {
  const url = `${BASE_URL}/api${endpoint}`;
  // const url = `https://s2mttv-3000.csb.app/api${endpoint}`;
  console.log("URL:" + url);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching model:", error);
    throw error;
  }
}

export async function postModelData(endpoint, data) {
  const url = `${BASE_URL}/api${endpoint}`;
  console.log("URL:", url);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}
