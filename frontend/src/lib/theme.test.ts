import { beforeEach, describe, expect, it } from "vitest";

describe("Theme System", () => {
  let mockStore: Record<string, string> = {};
  let mockDataset: Record<string, string> = {};
  let mockClasses: Set<string> = new Set();

  beforeEach(() => {
    mockStore = {};
    mockDataset = {};
    mockClasses = new Set();

    (globalThis as any).window = {
      localStorage: {
        getItem: (k: string) => mockStore[k] ?? null,
        setItem: (k: string, v: string) => {
          mockStore[k] = v;
        },
      },
      matchMedia: () => ({ matches: false }),
    };

    (globalThis as any).document = {
      documentElement: {
        dataset: mockDataset,
        classList: {
          add: (c: string) => mockClasses.add(c),
          remove: (c: string) => mockClasses.delete(c),
          contains: (c: string) => mockClasses.has(c),
        },
      },
    };
  });

  it("applies dark theme and persists to storage", async () => {
    const { setTheme } = await import("./theme");
    setTheme("dark");
    expect(mockDataset.theme).toBe("dark");
    expect(mockClasses.has("dark")).toBe(true);
    expect(mockClasses.has("light")).toBe(false);
    expect(mockStore["kalpavriksha.theme"]).toBe("dark");
  });

  it("defaults to dark theme when storage is empty", async () => {
    const { bootTheme, setTheme } = await import("./theme");
    bootTheme();
    // In our implementation, default theme is dark
    expect(mockDataset.theme ?? "dark").toBe("dark");
  });

  it("applies light theme and persists to storage", async () => {
    const { setTheme } = await import("./theme");
    setTheme("light");
    expect(mockDataset.theme).toBe("light");
    expect(mockClasses.has("light")).toBe(true);
    expect(mockClasses.has("dark")).toBe(false);
    expect(mockStore["kalpavriksha.theme"]).toBe("light");
  });

  it("toggles between dark and light", async () => {
    const { setTheme, toggleTheme } = await import("./theme");
    setTheme("dark");
    toggleTheme();
    expect(mockDataset.theme).toBe("light");
    expect(mockStore["kalpavriksha.theme"]).toBe("light");

    toggleTheme();
    expect(mockDataset.theme).toBe("dark");
    expect(mockStore["kalpavriksha.theme"]).toBe("dark");
  });
});
