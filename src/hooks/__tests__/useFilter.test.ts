import { renderHook, act } from "@testing-library/react";
import { useFilter } from "../useFilter";

const mockTasks = [
  { id: "1", title: "Learn React", priority: "high", status: "todo", labels: ["frontend"] },
  { id: "2", title: "Design API", priority: "medium", status: "in_progress", labels: ["backend"] },
  { id: "3", title: "Add tests", priority: "low", status: "done", labels: ["frontend", "testing"] },
  { id: "4", title: "Prepare deploy", priority: "high", status: "todo", labels: ["devops"] },
];

describe("useFilter", () => {
    it('returns all tasks in the initial state', () => {
        const { result } = renderHook(() => useFilter(mockTasks));
        expect(result.current.filteredItems).toHaveLength(4);
    })

    it('filters by text search', () => {
        const { result } = renderHook(() => useFilter(mockTasks));
        
        act(() => {
            result.current.setSearchQuery("React");
        })

        expect(result.current.filteredItems).toHaveLength(1);
        expect(result.current.filteredItems[0].title).toBe("Learn React");
    })

    it('is case-insensitive', () => {
        const { result } = renderHook(() => useFilter(mockTasks));
        
        act(() => {
            result.current.setSearchQuery("React");
        })

        expect(result.current.filteredItems).toHaveLength(1);
        expect(result.current.filteredItems[0].title).toBe("Learn React");
    })

    it('filters by priority', () => {
        const { result } = renderHook(() => useFilter(mockTasks));
        
        act(() => {
            result.current.setPriorityFilter("high");
        })

        expect(result.current.filteredItems).toHaveLength(2);
    })

    it('filters by status', () => {
        const { result } = renderHook(() => useFilter(mockTasks));
        
        act(() => {
            result.current.setStatusFilter("todo");
        })

        expect(result.current.filteredItems).toHaveLength(2);
    })

    it('combines multiple filters', () => {
        const { result } = renderHook(() => useFilter(mockTasks));
        
        act(() => {
            result.current.setPriorityFilter("high");
            result.current.setStatusFilter("todo");
        })

        expect(result.current.filteredItems).toHaveLength(2);
    })

    it("resets filters", () => {
        const { result } = renderHook(() => useFilter(mockTasks));
        
        act(() => {
            result.current.setSearchQuery("React");
            result.current.resetFilters();
        });
        
        expect(result.current.filteredItems).toHaveLength(4);
        expect(result.current.searchQuery).toBe("");
    });
});

describe("useFilter - edge cases", () => {
    it("returns an empty result for an empty array", () => {
      const { result } = renderHook(() => useFilter([]));
      expect(result.current.filteredItems).toHaveLength(0);
    });
  
    it("updates results when items change dynamically", () => {
      const { result, rerender } = renderHook(
        ({ items }) => useFilter(items),
        { initialProps: { items: mockTasks } }
      );
  
      expect(result.current.filteredItems).toHaveLength(4);
  
      const newTasks = mockTasks.slice(0, 2);
      rerender({ items: newTasks });
  
      expect(result.current.filteredItems).toHaveLength(2);
    });
  
    it("matches partial search queries", () => {
      const { result } = renderHook(() => useFilter(mockTasks));
  
      act(() => {
        result.current.setSearchQuery("React");
      });
  
      expect(result.current.filteredItems).toHaveLength(1);
      expect(result.current.filteredItems[0].title).toBe("Learn React");
    });
  
    it("filters correctly when all filters are combined", () => {
      const { result } = renderHook(() => useFilter(mockTasks));
  
      act(() => {
        result.current.setSearchQuery("React");
        result.current.setPriorityFilter("high");
        result.current.setStatusFilter("todo");
      });
  
      expect(result.current.filteredItems).toHaveLength(1);
      expect(result.current.filteredItems[0].id).toBe("1");
    });
  
    it("returns an empty array when no items match the filter", () => {
      const { result } = renderHook(() => useFilter(mockTasks));
  
      act(() => {
        result.current.setSearchQuery("nonexistent task");
      });
  
      expect(result.current.filteredItems).toHaveLength(0);
    });
  });
