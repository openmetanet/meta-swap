import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
// Vue.config.devtools=true
export default new Vuex.Store({
  state: {
    userData: "",
    appAccessToken: "",
    metaidjs: "",
    // appMetaIdJsV2:"",
    InjectorShow: false,
    loginLoding: false,
    PhoneShow: false,
    accessToken: null,
    lang: "zh",
    fromAccount: {
      bsv: 0,
      satoshi: 0,
    },
    toAccount: {
      ftBalance: "0",
      ftSymbol: "MC",
      ftTimestamp: 1626073510892,
      ftName: "MetaCoin",
      ftTotalSupply: 800000000,
      ftIssuer: "OpenMetaNetFoundation",
      ftWebsite: "https://omf.foundation",
      ftName: "MetaCoin",
      ftCodehash: "514776383faa66e4a65808904d4d6724e4774fbe",
      ftSensibleId:
        "7a58cd7f7a315ea1da3a1896159a38baf71f6c2ff1f8313b4638bb3599a2cf8a00000000",
      ftIcon:
        "metafile://2faa46d7e41ebf2740aac0069136f0fc8f587024750e6a2175948fc5de46d63b",
      ftDecimalNum: 8,
    },
    isMobile: false,
  },
  getters: {
    userData(state) {
      return state.userData;
    },
    isLogined(state) {
      return !!state.accessToken && !!state.userData;
    },
    hasAccessToken(state) {
      return !!state.accessToken;
    },
    accessToken(state) {
      if (state.accessToken) {
        return state.accessToken;
      } else {
        return localStorage.getItem("access_token");
      }
    },
  },
  mutations: {
    getUserAgent(state, payload) {
      state.isMobile = payload;
    },
    setFromAccount(state, payload) {
      if (payload) {
        state.fromAccount = payload;
      } else {
        state.fromAccount = {
          bsv: 0,
          satoshi: 0,
        };
      }
    },
    setToAccount(state, payload) {
      if (payload) {
        state.toAccount = payload;
      } else {
        state.toAccount = {
          ftBalance: "0",
          ftSymbol: "MC",
          ftTimestamp: 1626073510892,
          ftName: "MetaCoin",
          ftTotalSupply: 800000000,
          ftIssuer: "OpenMetaNetFoundation",
          ftWebsite: "https://omf.foundation",
          ftName: "MetaCoin",
          ftCodehash: "514776383faa66e4a65808904d4d6724e4774fbe",
          ftSensibleId:
            "7a58cd7f7a315ea1da3a1896159a38baf71f6c2ff1f8313b4638bb3599a2cf8a00000000",
          ftIcon:
            "metafile://2faa46d7e41ebf2740aac0069136f0fc8f587024750e6a2175948fc5de46d63b",
          ftDecimalNum: 8,
        };
      }
    },
    setLang(state, payload) {
      state.lang = payload;
    },
    setUserData(state, payload) {
      state.userData = payload;
    },
    setAccessToken(state, token) {
      state.appAccessToken = token;
    },
    setMetaidjs(state, payload) {
      state.metaidjs = payload;
    },
  },
  actions: {
    asyncSetAccessToken({ commit }, payload) {
      commit("setAccessToken", payload);
    },
    asyncSetMetaidJs({ commit }, payload) {
      commit("setMetaidjs", payload);
    },
    asyncSetFromAccount({ commit }, payload) {
      commit("setFromAccount", payload);
    },
    asyncSetToAccount({ commit }, payload) {
      commit("setToAccount", payload);
    },
  },
});
