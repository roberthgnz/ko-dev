// @ts-ignore
const updateAction = (state, payload) => {
  return {
    ...state,
    onboarding: {
      ...state.onboarding,
      ...payload,
    },
  }
}

export default updateAction
