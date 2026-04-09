import { renderHook, act } from "@testing-library/react"
import { useMediaQuery } from "@/hooks/use-media-query"

describe("useMediaQuery", () => {
  let listeners: Map<string, (e: { matches: boolean }) => void>

  beforeEach(() => {
    listeners = new Map()

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn((_event: string, cb: (e: { matches: boolean }) => void) => {
          listeners.set(query, cb)
        }),
        removeEventListener: vi.fn((_event: string, _cb: unknown) => {
          listeners.delete(query)
        }),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  it("returns false when media query does not match", () => {
    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"))

    expect(result.current).toBe(false)
  })

  it("returns true when media query matches", () => {
    vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"))

    expect(result.current).toBe(true)
  })

  it("updates when media query changes", () => {
    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"))

    expect(result.current).toBe(false)

    // Simulate a media query change
    act(() => {
      const listener = listeners.get("(min-width: 768px)")
      listener?.({ matches: true })
    })

    expect(result.current).toBe(true)
  })

  it("cleans up event listener on unmount", () => {
    const removeEventListener = vi.fn()
    vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener,
      dispatchEvent: vi.fn(),
    }))

    const { unmount } = renderHook(() => useMediaQuery("(min-width: 768px)"))

    unmount()

    expect(removeEventListener).toHaveBeenCalledWith("change", expect.any(Function))
  })
})
