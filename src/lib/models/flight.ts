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

export interface DatePrice {
  date: number;
  price: string;
  priceValue: number;
  isSelected?: boolean;
  isReturnSelected?: boolean;
  isInRange?: boolean;
  isDisabled?: boolean;
  isPast?: boolean;
  isLowestPrice?: boolean;
  isHighestPrice?: boolean;
}

export interface PriceData {
  [key: string]: number; // date string -> price
}

export type PriceCalendarDay = {
  day: string;
  group: string;
  price: number;
};

export type PriceCalendarFlights = {
  noPriceLabel: string;
  groups: Record<string, unknown>[];
  days: PriceCalendarDay[];
  currency: string;
};

export type PriceCalendarResponse = {
  status: boolean;
  timestamp: number;
  data: {
    flights: PriceCalendarFlights;
  };
};

/**
 * Flight search response interface
 */
export interface SearchFlightResponse {
  status: boolean;
  timestamp: number;
  sessionId: string;
  data: {
    context: {
      status: string;
      totalResults: number;
    };
    itineraries: Itinerary[];
    messages: unknown[];
    filterStats: FilterStats;
  };
}

export interface Itinerary {
  id: string;
  price: Price;
  legs: Leg[];
  isSelfTransfer: boolean;
  isProtectedSelfTransfer: boolean;
  farePolicy: FarePolicy;
  eco?: {
    ecoContenderDelta: number;
  };
  tags: string[];
  isMashUp: boolean;
  hasFlexibleOptions: boolean;
  score: number;
}

export interface Price {
  raw: number;
  formatted: string;
}

export interface Leg {
  id: string;
  origin: IAirport;
  destination: IAirport;
  durationInMinutes: number;
  stopCount: number;
  isSmallestStops: boolean;
  departure: string;
  arrival: string;
  timeDeltaInDays: number;
  carriers: Carriers;
  segments: Segment[];
}

export interface IAirport {
  id: string;
  name: string;
  displayCode: string;
  city: string;
  isHighlighted: boolean;
}

export interface Carriers {
  marketing: MarketingCarrier[];
  operationType: string;
}

export interface MarketingCarrier {
  id: number;
  logoUrl: string;
  name: string;
}

export interface Segment {
  id: string;
  origin: FlightPlace;
  destination: FlightPlace;
  departure: string;
  arrival: string;
  durationInMinutes: number;
  flightNumber: string;
  marketingCarrier: Carrier;
  operatingCarrier: Carrier;
}

export interface FlightPlace {
  flightPlaceId: string;
  displayCode: string;
  parent: {
    flightPlaceId: string;
    displayCode: string;
    name: string;
    type: string;
  };
  name: string;
  type: string;
}

export interface Carrier {
  id: number;
  name: string;
  alternateId: string;
  allianceId: number;
}

export interface FarePolicy {
  isChangeAllowed: boolean;
  isPartiallyChangeable: boolean;
  isCancellationAllowed: boolean;
  isPartiallyRefundable: boolean;
}

export interface FilterStats {
  duration: {
    min: number;
    max: number;
  };
  airports: AirportGroup[];
  carriers: FilterCarrier[];
  stopPrices: StopPrices;
}

export interface AirportGroup {
  city: string;
  airports: {
    id: string;
    name: string;
  }[];
}

export interface FilterCarrier {
  id: number;
  logoUrl: string;
  name: string;
}

export interface StopPrices {
  direct: StopPrice;
  one: StopPrice;
  twoOrMore: {
    isPresent: boolean;
  };
}

export interface StopPrice {
  isPresent: boolean;
  formattedPrice?: string;
}
