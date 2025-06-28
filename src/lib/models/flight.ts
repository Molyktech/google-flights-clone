export interface LocationOption {
  id: string;
  skyId: string;
  entityId: string;
  name: string;
  suggestionTitle: string;
  subtitle: string;
  code: string;
  entityType: string;
  parentId?: string;
  latitude?: number;
  longitude?: number;
}

export interface AirportNavigation {
  entityId: string;
  entityType: string;
  localizedName: string;
  relevantFlightParams: {
    skyId: string;
    entityId: string;
    flightPlaceType: string;
    localizedName: string;
  };
  relevantHotelParams?: {
    entityId: string;
    entityType: string;
    localizedName: string;
  };
  geoCode?: {
    latitude: number;
    longitude: number;
  };
}
export interface Airport {
  skyId: string;
  entityId: string;
  presentation: {
    title: string;
    suggestionTitle: string;
    subtitle?: string;
  };
  navigation: AirportNavigation;
}

export interface SearchAirportResponse {
  status: boolean;
  message?: string;
  timestamp?: number;
  data: Airport[];
}
export interface NearbyAirport {
  skyId: string;
  entityId: string;
  name: string;
  iata: string;
  city: string;
  country: string;
  distance: {
    value: number;
    unit: string;
  };
}

export interface NearbyAirportsResponseData {
  current: {
    presentation: { title: string; suggestionTitle: string; subtitle?: string };
    navigation: {
      entityId: string;
      entityType: string;
      localizedName: string;
      relevantFlightParams: { skyId: string; entityId: string; flightPlaceType: string; localizedName: string };
      relevantHotelParams?: { entityId: string; entityType: string; localizedName: string };
    };
  };
  nearby: NearbyAirport[];
  recent: NearbyAirport[];
}

export interface NearbyAirportsResponse {
  status: boolean;
  timestamp: number;
  data: NearbyAirportsResponseData;
}

// Represents the counts for each passenger type in a flight search
export interface PassengerCounts {
  adults: number;
  children: number;
  infantsSeat: number;
  infantsLap: number;
}
