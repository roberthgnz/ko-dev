// https://github.com/streamich/react-use/blob/master/src/useSessionStorage.ts
import { useEffect, useState } from "react"

const isBrowser = typeof window !== "undefined"

const useSessionStorage = <T>(
  key: string,
  initialValue?: T,
  raw?: boolean
): [T, (value: T) => void] => {
  if (!isBrowser) {
    return [initialValue as T, () => {}]
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [state, setState] = useState<T>(() => {
    try {
      const sessionStorageValue = sessionStorage.getItem(key)
      if (typeof sessionStorageValue !== "string") {
        sessionStorage.setItem(
          key,
          raw ? String(initialValue) : JSON.stringify(initialValue)
        )
        return initialValue
      } else {
        return raw
          ? sessionStorageValue
          : JSON.parse(sessionStorageValue || "null")
      }
    } catch {
      // If user is in private mode or has storage restriction
      // sessionStorage can throw. JSON.parse and JSON.stringify
      // can throw, too.
      return initialValue
    }
  })

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    try {
      const serializedState = raw ? String(state) : JSON.stringify(state)
      sessionStorage.setItem(key, serializedState)
    } catch {
      // If user is in private mode or has storage restriction
      // sessionStorage can throw. Also JSON.stringify can throw.
    }
  })

  return [state, setState]
}

export default useSessionStorage
