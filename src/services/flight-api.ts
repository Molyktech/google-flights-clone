/* eslint-disable */
import type { SearchAirportResponse, NearbyAirportsResponse } from "../lib/models/flight";
import { MOCK_DATA } from "./mock-data";

// --- Config ---
const FLIGHT_API_BASE_URL = import.meta.env.VITE_FLIGHT_API_BASE_URL || "https://sky-scrapper.p.rapidapi.com/api/";

// --- Helpers ---
/**
 * Get common headers for RapidAPI requests
 */
const getHeaders = () => ({
  "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY || "54f89fd97dmshd023b771436df2dp11e39bjsn6f7240e3d68e",
  "X-RapidAPI-Host": "sky-scrapper.p.rapidapi.com",
});

/**
 * Generic fetch wrapper for RapidAPI
 */
const rapidApiFetch = async <T = unknown>(url: string, options: RequestInit = {}): Promise<T> => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("RapidAPI fetch error:", error);
    throw error;
  }
};

// --- API Functions ---
/**
 * Search for airports and cities based on user input
 */
export const searchAirport = async (query: string): Promise<SearchAirportResponse> => {
  const url = `${FLIGHT_API_BASE_URL}v1/flights/searchAirport?query=${encodeURIComponent(query)}&locale=en-US`;
  const options = { method: "GET", headers: getHeaders() };
  try {
    // const data = await rapidApiFetch<SearchAirportResponse>(url, options);
    const data = MOCK_DATA;
    // if (Array.isArray((data as any).data)) {
    //     console.log("here",data);
    //   return data as SearchAirportResponse;
    // } else if (Array.isArray(data)) {
    //   return { status: true, data } as SearchAirportResponse;
    // } else {
    //   return { status: false, data: [] } as SearchAirportResponse;
    // }
    return data as SearchAirportResponse;
  } catch (error) {
    return { status: false, data: [] };
  }
};

/**
 * Get nearby airports for a specific location
 */
export const getNearbyAirports = async (lat: number, lng: number, radius = 100): Promise<NearbyAirportsResponse> => {
  const url = `${FLIGHT_API_BASE_URL}v1/flights/getNearByAirports?lat=${lat}&lng=${lng}&radius=${radius}`;
  const options = { method: "GET", headers: getHeaders() };
  try {
    return await rapidApiFetch<NearbyAirportsResponse>(url, options);
  } catch (error) {
    return { status: false, timestamp: Date.now(), data: { current: null as any, nearby: [], recent: [] } };
  }
};

/**
 * Search flights with complete details
 */
export const searchFlightsComplete = async (params: {
  originSkyId: string;
  destinationSkyId: string;
  originEntityId: string;
  destinationEntityId: string;
  date: string;
  returnDate?: string;
  cabinClass: string;
  adults: number;
  sortBy?: string;
  limit?: number;
  currency?: string;
}) => {
  const queryParams = new URLSearchParams({
    originSkyId: params.originSkyId,
    destinationSkyId: params.destinationSkyId,
    originEntityId: params.originEntityId,
    destinationEntityId: params.destinationEntityId,
    date: params.date,
    cabinClass: params.cabinClass,
    adults: params.adults.toString(),
    sortBy: params.sortBy || "best",
    limit: (params.limit || 50).toString(),
    currency: params.currency || "USD",
    ...(params.returnDate && { returnDate: params.returnDate }),
  });
  const url = `${FLIGHT_API_BASE_URL}v2/flights/searchFlightsComplete?${queryParams}`;
  const options = { method: "GET", headers: getHeaders() };
  return rapidApiFetch(url, options);
};

/**
 * Search flights everywhere from a specific origin
 */
export const searchFlightEverywhere = async (params: {
  originSkyId: string;
  originEntityId: string;
  anytime?: boolean;
  duration?: string;
  currency?: string;
}) => {
  const queryParams = new URLSearchParams({
    originSkyId: params.originSkyId,
    originEntityId: params.originEntityId,
    anytime: (params.anytime || false).toString(),
    duration: params.duration || "week",
    currency: params.currency || "USD",
  });
  const url = `${FLIGHT_API_BASE_URL}v1/flights/searchFlightEverywhere?${queryParams}`;
  const options = { method: "GET", headers: getHeaders() };
  return rapidApiFetch(url, options);
};

/**
 * Get price calendar for flexible date searches
 */
export const getPriceCalendar = async (params: {
  originSkyId: string;
  destinationSkyId: string;
  originEntityId: string;
  destinationEntityId: string;
  month: string;
  year: string;
  currency?: string;
}) => {
  const queryParams = new URLSearchParams({
    originSkyId: params.originSkyId,
    destinationSkyId: params.destinationSkyId,
    originEntityId: params.originEntityId,
    destinationEntityId: params.destinationEntityId,
    month: params.month,
    year: params.year,
    currency: params.currency || "USD",
  });
  const url = `${FLIGHT_API_BASE_URL}v1/flights/getPriceCalendar?${queryParams}`;
  const options = { method: "GET", headers: getHeaders() };
  return rapidApiFetch(url, options);
};
