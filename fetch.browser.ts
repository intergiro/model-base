export const fetch = typeof window != "undefined" ? window.fetch.bind(window) : self.fetch.bind(self)
