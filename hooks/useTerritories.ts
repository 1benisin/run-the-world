import { useCallback, useEffect, useState } from "react";
import { dummyTerritories } from "../data/dummyTerritories";
import { Territory } from "../types/map";

interface UseTerritoriesReturn {
  territories: Territory[];
  selectedTerritory: Territory | null;
  isLoading: boolean;
  error: Error | null;
  selectTerritory: (territory: Territory | null) => void;
  refreshTerritories: () => Promise<void>;
}

export const useTerritories = (): UseTerritoriesReturn => {
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshTerritories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Replace with actual API call
      // For now, we'll use dummy data
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay
      setTerritories(dummyTerritories);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch territories")
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectTerritory = useCallback((territory: Territory | null) => {
    setSelectedTerritory(territory);
  }, []);

  // Initial load
  useEffect(() => {
    refreshTerritories();
  }, [refreshTerritories]);

  return {
    territories,
    selectedTerritory,
    isLoading,
    error,
    selectTerritory,
    refreshTerritories,
  };
};
