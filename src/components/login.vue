<template>
  <div class="headerWrap">
    <div class="band">
      <img src="../assets/image/logo_mcswap@2x.png" alt="" />
      <span>{{ $t("metaCoinExchange") }}</span>
    </div>
    <div class="headerRight">
      <div class="lang" @click.stop="traggleLang">
        <span>{{ lang === "zh" ? "CN" : "EN" }}</span>
        <img src="../assets/image/arrowBottom.png" alt="" />
      </div>
      <van-button
        plain
        type="primary"
        class="loginBtn"
        @click="$utils.goShowMoney('login')"
        v-if="!userData && !$store.state.PhoneShow"
        loading-type="spinner"
        :loading="$store.state.loginLoding"
      >
        {{ $t("login") }}
      </van-button>
      <div v-else-if="!isInApp" class="poper">
        <van-popover
          v-model="showPopover"
          theme="dark"
          trigger="click"
          :actions="actions"
          @select="toDetail"
        >
          <template #reference>
            <div class="info">
              <div class="avatar">
                <img
                  :src="$store.state.userData.metaId | metaIdAvatar"
                  alt=""
                />
              </div>
            </div>
          </template>
        </van-popover>
      </div>
      <div v-else>
        <div class="info">
          <div class="avatar">
            <img :src="$store.state.userData.metaId | metaIdAvatar" alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getToken } from "@api/api";
import { mapGetters, mapState } from "vuex";
export default {
  name: "login",
  data() {
    return {
      redirectUri: process.env.VUE_APP_redirectUri,
      metaIdShow: false,
      showPopover: false,
      actions: [{ text: "钱包" }, { text: "退出" }],
      toggleLang: true,
    };
  },
  watch: {
    loginLoding: {
      handler(newVal) {
        if (newVal) {
          this.$toast.loading({
            message: `${this.$t("logining")}`,
            forbidClick: true,
            loadingType: "spinner",
            duration: 7000,
          });
        }
      },
      deep: true,
    },
  },
  computed: {
    ...mapState(["lang", "loginLoding", "phoneShow"]),
    ...mapGetters(["isLogined", "hasAccessToken", "userData"]),

    isInApp() {
      return window.appMetaIdJsV2;
    },
  },
  filters: {
    metaIdAvatar(showId) {
      return `${process.env.VUE_APP_AVATARURL}${showId}`;
    },
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        if (this.isInApp) {
          this.$store.state.PhoneShow = true;
          this.$store.state.InjectorShow = true;
          window.handleUserLoginData = this.handleUserLoginData;
          this.getUserLoginData();
        }
      }, 1000);
    });
  },
  created() {
    this.initApp();
  },
  methods: {
    traggleLang() {
      this.toggleLang = !this.toggleLang;
      this.toggleLang
        ? this.$store.commit("setLang", "zh")
        : this.$store.commit("setLang", "en");
      this.lang === "zh"
        ? (this.$i18n.locale = "zh")
        : (this.$i18n.locale = "en");
    },
    toDetail(actions, index) {
      switch (index) {
        case 0:
          window.open(process.env.VUE_APP_redirectUri);
          break;
        case 1:
          this.outLogin();
          break;
        default:
          break;
      }
    },
    createMeta() {
      this.metaIdShow = false;
      this.$store.state.loginLoding = false;
      localStorage.removeItem("access_token");
      this.$store.commit("setAccessToken", null);
      this.$cookie.remove("access_token");
      const tohttp = process.env.VUE_APP_redirectUri + "login";
      window.open(tohttp);
    },
    goShowwallet(url) {
      let httpUrl = process.env.VUE_APP_redirectUri;
      window.open(httpUrl + url);
    },
    outLogin() {
      localStorage.removeItem("access_token");
      this.$store.commit("setAccessToken", null);
      this.$cookie.remove("access_token");
      window.location.reload();
    },
    // 刷新token
    refreshToken(token) {
      const id = process.env.VUE_APP_appClientId;
      const secret = process.env.VUE_APP_appClientSecret;
      const params = {
        grant_type: "refresh_token",
        client_id: id,
        client_secret: secret,
        refresh_token: token,
      };
      return getToken(params).catch((err) => {
        return false;
      });
    },
    // 根据code获取token
    getUserToken() {
      const httpUrl = process.env.VUE_APP_httpUrl;
      const id = process.env.VUE_APP_appClientId;
      const secret = process.env.VUE_APP_appClientSecret;
      const params = {
        grant_type: "authorization_code",
        code: this.$route.query.code,
        redirect_uri: httpUrl,
        scope: "app",
        client_id: id,
        client_secret: secret,
      };

      getToken(params)
        .then((res) => {
          if (!res) return this.outLogin();
          const token = res.data.access_token;
          localStorage.setItem("access_token", JSON.stringify(res.data));
          this.$store.commit("setAccessToken", token);
          this.$cookie.set("access_token", token, res.data.expires_in);
          this.gotoUrl("Home");
          console.log(this.$route);
          this.setInjector();
        })
        .catch((err) => {
          if (err.response.status == 400) {
            this.outLogin();
          }
          return false;
        });
    },
    // 实例化第三方
    setInjector() {
      if (this.$store.state.metaidjs) {
        return;
      }
      const htmlUrl = process.env.VUE_APP_redirectUri;
      const that = this;
      const httpUrl = process.env.VUE_APP_httpUrl;
      const id = process.env.VUE_APP_appClientId;
      const secret = process.env.VUE_APP_appClientSecret;
      this.$store.state.metaidjs = new this.$metaidjs({
        baseUri: htmlUrl,
        oauthSettings: {
          clientId: id,
          clientSecret: secret,
          redirectUri: httpUrl,
        },
        onLoaded: function () {
          that.$store.state.InjectorShow = true;
          that.getUserLoginData();
        },
        onError: function (res) {
          console.log("setInjector onError:", res);
          if (res.code === 201) {
            that.$store.state.loginLoding = false;
            localStorage.removeItem("access_token");
            that.$store.commit("setAccessToken", null);
            that.$cookie.remove("access_token");
          }
        },
      });
      this.metaidjs = this.$store.state.metaidjs;
    },
    // 获取用户信息
    getUserLoginData() {
      const accessToken = this.$cookie.get("access_token") || "";
      if (this.isInApp) {
        const appClientId = process.env.VUE_APP_appClientId;
        const appClientSecret = process.env.VUE_APP_appClientSecret;
        console.log(appClientId);
        window.appMetaIdJsV2.getUserInfo(
          appClientId,
          appClientSecret,
          "handleUserLoginData"
        );
      } else if (accessToken) {
        console.log("web getUserInfo");
        this.metaidjs.getUserInfo({
          accessToken,
          callback: this.handleUserLoginData,
        });
      }
    },
    handleUserLoginData(res) {
      if (typeof res === "string") {
        res = JSON.parse(res);
      }
      const accessToken = this.$cookie.get("access_token") || "";
      if (res.code === 200) {
        this.$store.state.loginLoding = false;
        this.$store.state.InjectorShow = true;
        this.$store.state.userData = res.data;
        this.$store.state.userData.accessToken = accessToken;
        if (window.appMetaIdJsV2) {
          this.$store.state.userData.accessToken = res.appAccessToken;
          this.$store.dispatch("asyncSetAccessToken", res.appAccessToken);
        }
        this.InjectorLock = true;
        this.$forceUpdate();
      } else if (res.code === 202) {
        this.$store.state.loginLoding = false;
        this.metaIdShow = true;
      } else {
        this.$store.state.loginLoding = false;

        localStorage.removeItem("access_token");
        this.$store.commit("setAccessToken", null);
        this.$cookie.remove("access_token");
        this.outLogin();
      }
    },
    initApp() {
      if (this.$route.query.code) {
        this.$store.state.loginLoding = true;
        setTimeout(() => {
          if (this.$store.state.loginLoding) {
            this.$store.state.loginLoding = false;
            this.$cookie.remove("access_token");
          }
        }, 40000);
        this.getUserToken();
      } else {
        if (localStorage.getItem("access_token")) {
          if (this.$store.state.loginLoding) return;

          this.$store.state.loginLoding = true;
          const token = JSON.parse(
            localStorage.getItem("access_token") || ""
          ).refresh_token;
          this.refreshToken(token).then((res) => {
            if (!res) return this.outLogin();
            const token = res.data.access_token;
            if (!token) {
              return;
            }
            localStorage.setItem("access_token", JSON.stringify(res.data));
            this.$store.commit("setAccessToken", token);
            this.$cookie.set("access_token", token, res.data.expires_in);
            this.setInjector();
            this.$store.state.loginLoding = false;
            setTimeout(() => {
              if (this.$store.state.loginLoding) {
                this.$store.state.loginLoding = false;
                this.$cookie.remove("access_token");
              }
            }, 40000);
          });
        } else {
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.headerWrap {
  margin-bottom: 0.357143rem /* 5/14 */;
  padding: 0 1.071429rem /* 15/14 */;
  border-bottom: 0.071429rem /* 1/14 */ solid #f7f9fc;

  display: flex;
  justify-content: space-between;
  align-items: center;
  .headerRight {
    display: flex;
    align-items: center;
    .lang {
      margin-right: 0.714286rem /* 10/14 */;
      img {
        width: 0.714286rem /* 10/14 */;
      }
      span {
        font-size: 1rem /* 14/14 */;
        color: #6e6d7a;
      }
    }
  }
  .loginBtn.van-button.van-button--primary.van-button--normal.van-button--plain {
    color: #01bafb;
    font-size: 1rem /* 14/14 */;
    cursor: pointer;
    border: 1px solid #fff;
  }

  .band {
    padding: 0.857143rem /* 12/14 */ 0;
    display: flex;
    align-items: center;
    img {
      width: 1.428571rem /* 20/14 */;
      height: 1.285714rem /* 18/14 */;
    }
    span {
      padding-left: 0.357143rem /* 5/14 */;
      font-size: 1.142857rem /* 16/14 */;
      color: #303133;

      letter-spacing: 0.071429rem /* 1/14 */;
    }
  }
  .info {
    display: flex;

    justify-content: center;
    align-items: center;
    .right {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      text-align: left;
      margin-left: 10px;
    }
  }
  .logout {
    margin-left: 0.357143rem /* 5/14 */;
  }
  .name {
    font-size: 18px;
    color: #333333;
  }
  .mataid {
    font-size: 14px;
    color: #999999;
  }
  .avatar {
    width: 1.857143rem /* 26/14 */;
    height: 1.857143rem /* 26/14 */;
    border-radius: 1.857143rem /* 26/14 */;
    img {
      width: 1.857143rem /* 26/14 */;
      height: 1.857143rem /* 26/14 */;
      object-fit: contain;
      border-radius: 1.857143rem /* 26/14 */;
    }
  }
}
</style>
