// hooks/useFlightSuggestions.ts
import { useEffect, useState } from "react";
import type { LocationOption, NearbyAirportsResponse } from "../lib/models/flight";
import { toLocationOptions } from "../lib/utils";
import { getNearbyAirports, searchAirport } from "../services/flight-api";
import { useDebounce } from "./useDebounce";

export function useFlightSuggestions(query: string) {
  const [options, setOptions] = useState<LocationOption[]>([]);
  const [loading, setLoading] = useState(false);
  const debounced = useDebounce(query, 300);

  //   useEffect(() => {
  //     if (debounced.length < 2) return setOptions([]);
  //     let active = true;
  //     setLoading(true);

  //     searchAirport(debounced)
  //       .then((res) => {
  //         if (active && res.status && res.data) {
  //           setOptions(toLocationOptions(res.data));
  //         }
  //       })
  //       .catch(() => active && setOptions([]))
  //       .finally(() => active && setLoading(false));

  //     return () => {
  //       active = false;
  //     };
  //   }, [debounced]);

  useEffect(() => {
    if (debounced.length < 2) return setOptions([]);
    let active = true;
    setLoading(true);

    (async () => {
      // 1) fetch initial suggestions (regions, cities, airports)
      const res = await searchAirport(debounced);
      if (!active) return;

      const initial = res.status && res.data ? toLocationOptions(res.data) : [];

      // 2) for every non-airport result that has coords, fetch its nearby airports
      const regions = initial.filter(
        (opt) => opt.entityType !== "AIRPORT" && opt.latitude != null && opt.longitude != null,
      );

      const nearbyLists = await Promise.all(
        regions.map((r) =>
          getNearbyAirports(r.latitude!, r.longitude!, 100)
            .then((resp: NearbyAirportsResponse) =>
              resp.status ? toLocationOptions(resp.data.nearby).map((a) => ({ ...a, parentId: r.id })) : [],
            )
            .catch(() => []),
        ),
      );

      if (!active) return;

      // 3) merge top-level suggestions + all fetched airports
      setOptions([...initial, ...nearbyLists.flat()]);
      setLoading(false);
      console.log(options);
    })();

    return () => {
      active = false;
    };
  }, [debounced]);

  return { options, loading };
}
