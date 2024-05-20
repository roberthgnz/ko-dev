"use client"

import React from "react"

type ProfileContextProps = {
  username: string
  profile: any
  user: any
  owner: boolean
  following: boolean
  followers: any[]
  posts: any[]
}

export const ProfileContext = React.createContext({
  username: "",
  profile: {},
  user: {},
  owner: false,
  following: false,
  followers: [],
  posts: [],
})

export const ProfileContextProvider = ({
  children,
  ...props
}: {
  children: React.ReactNode
} & ProfileContextProps) => {
  return (
    // @ts-ignore
    <ProfileContext.Provider value={props}>{children}</ProfileContext.Provider>
  )
}
