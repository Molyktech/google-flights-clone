import type { LocationOption, Airport, NearbyAirport } from "./models/flight";

/**
 * Convert a mixed list of Airport | NearbyAirport into your UI-friendly LocationOption[]
 */
export function toLocationOptions(items: Array<Airport | NearbyAirport>): LocationOption[] {
  return items.map((item) => {
    // If it has `presentation`, it's the full Airport shape
    if ("presentation" in item) {
      const { presentation, navigation, skyId, entityId } = item as Airport;
      const match = presentation.suggestionTitle.match(/\(([^)]+)\)/);
      return {
        id: `${skyId}_${entityId}`,
        skyId,
        entityId,
        name: presentation.title,
        suggestionTitle: presentation.suggestionTitle,
        subtitle: presentation.subtitle || "",
        code: match ? match[1] : skyId,
        entityType: navigation.entityType,
        latitude: navigation.geoCode?.latitude,
        longitude: navigation.geoCode?.longitude,
      };
    }

    // Otherwise it's a NearbyAirport
    const na = item as NearbyAirport;
    return {
      id: `${na.skyId}_${na.entityId}`,
      skyId: na.skyId,
      entityId: na.entityId,
      name: na.name,
      suggestionTitle: `${na.name} (${na.iata})`,
      subtitle: `${na.city}, ${na.country}`,
      code: na.iata,
      entityType: "AIRPORT",
      latitude: undefined,
      longitude: undefined,
    };
  });
}

export const formatDate = (date: Date | null) => {
  if (!date) return "Select date";
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
};

export function formatToISODateString(date: string | Date | undefined | null): string | undefined {
  if (!date) return undefined;
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return undefined;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseSearchParams(search: string) {
  const params = new URLSearchParams(search);
  return {
    tripType: params.get("tripType") || undefined,
    from: params.get("from") || undefined,
    to: params.get("to") || undefined,
    departureDate: params.get("departureDate") || undefined,
    returnDate: params.get("returnDate") || undefined,
    adults: params.get("adults") ? Number(params.get("adults")) : undefined,
    children: params.get("children") ? Number(params.get("children")) : undefined,
    infantsSeat: params.get("infantsSeat") ? Number(params.get("infantsSeat")) : undefined,
    infantsLap: params.get("infantsLap") ? Number(params.get("infantsLap")) : undefined,
    flightClass: params.get("flightClass") || undefined,
  };
}
