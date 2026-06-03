import { useState, useMemo } from "react";

interface FilterableItem {
  id: string;
  title: string;
  priority: string;
  status: string;
  labels: string[];
}

interface UseFilterReturn<T extends FilterableItem> {
  filteredItems: T[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  priorityFilter: string;
  setPriorityFilter: (priority: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  resetFilters: () => void;
}

export function useFilter<T extends FilterableItem>(
  items: T[]
): UseFilterReturn<T> {
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPriority =
        priorityFilter === "" || item.priority === priorityFilter;

      const matchesStatus =
        statusFilter === "" || item.status === statusFilter;

      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [items, searchQuery, priorityFilter, statusFilter]);

  const resetFilters = () => {
    setSearchQuery("");
    setPriorityFilter("");
    setStatusFilter("");
  };

  return {
    filteredItems,
    searchQuery,
    setSearchQuery,
    priorityFilter,
    setPriorityFilter,
    statusFilter,
    setStatusFilter,
    resetFilters,
  };
}