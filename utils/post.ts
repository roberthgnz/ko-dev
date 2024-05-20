type Visibility = "public" | "private" | "unlisted"

type VisibilityOptionsParams = {
  price: number
  owner: boolean
  visibility: Visibility
  following: boolean
}

export const getVisibilityOptions = ({
  price,
  owner,
  visibility,
  following,
}: VisibilityOptionsParams) => {
  const options = {
    locked: false,
    props: {},
  }

  // Se muestra si es tu post o es público
  if (owner || visibility === "public") return options

  // Solo para followers
  if (visibility === "private") {
    options.props = {
      must_follow: true,
    }
    // Si tiene precio ocultar a followers
    if (price) {
      options.locked = true
      options.props = { price }
    } else {
      // Si no tiene precio solo mostrar a followers
      options.locked = !following
    }
  }

  return options
}
