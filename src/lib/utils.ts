import type { LocationOption, Airport, NearbyAirport } from "./models/flight";

/**
 * Convert a mixed list of Airport | NearbyAirport into your UI-friendly LocationOption[]
 */
export function toLocationOptions(items: Array<Airport | NearbyAirport>): LocationOption[] {
  return items.map((item) => {
    // If it has `presentation`, it’s the full Airport shape
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

    // Otherwise it’s a NearbyAirport
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
