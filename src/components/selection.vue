<template>
  <div class="selectionWrap">
    <div class="top">
      <span class="source">{{ $t("from") }}</span>
      <span class="account"
        >{{ $t("account") }}：{{
          token1 === "BSV" ? fromAccount.bsv : toAccount.ftBalance
        }}&nbsp;{{ token1 === "BSV" ? "BSV" : `${toAccount.ftSymbol}` }}</span
      >
    </div>
    <div class="foot">
      <!-- <van-field
        v-model.trim="from"
        type="number"
        :placeholder="inputPlace"
        @input="appMetaIdJsV2 ? debounce(appCurrentQuo, 2000) :debounce(currentQuo, 2000)"
      /> -->
      <!-- <van-field
        v-model.trim="from"
        type="number"
        :placeholder="inputPlace"
        @keyup="from=validator(from)"
      /> -->
      <van-field
        v-model.trim="from"
        type="number"
        :placeholder="inputPlace"
        @keyup="
          appMetaIdJsV2
            ? appCurrentQuo(payToRecevice)
            : currentQuo(payToRecevice)
        "
      />
      <div class="ftList" @click="openDialog(token1)">
        <img src="../assets/image/BSV.svg" v-if="token1 === 'BSV'" alt="" />
        <img :src="toAccount.ftIcon | imgUrl" alt="" v-if="token1 !== 'BSV'" />
        <span>{{ token1 }}</span>
      </div>
    </div>
    <div class="selectionIcon">
      <img src="../assets/image/ins@2x.png" alt="" @click="toggleCoin()" />
    </div>
    <div class="top">
      <span class="source">{{ $t("to") }}{{ $t("estimeted") }}</span>
      <span class="account"
        >{{ $t("account") }}：{{
          token2 === "BSV" ? fromAccount.bsv : toAccount.ftBalance
        }}&nbsp;{{ token2 === "BSV" ? "BSV" : `${toAccount.ftSymbol}` }}</span
      >
    </div>
    <div class="foot">
      <van-field
        v-model.trim="recevice"
        type="number"
        :placeholder="inputPlace"
        @keyup="
          appMetaIdJsV2
            ? appCurrentQuo(receviceToPay)
            : currentQuo(receviceToPay)
        "
      />
      <!-- <van-field :value="recevice | toDecimal" type="number" readonly /> -->
      <div class="ftList" @click="openDialog(token2)">
        <img :src="toAccount.ftIcon | imgUrl" alt="" v-if="token2 !== 'BSV'" />
        <img src="../assets/image/BSV.svg" v-if="token2 === 'BSV'" alt="" />
        <span>{{ token2 }}</span>
      </div>
    </div>
    <!--底部-->
    <div class="PayDetailWrap">
      <div class="top">
        <span>{{ $t("price") }}</span>
        <span v-if="token1 !== 'BSV'"
          >1&nbsp;MC&nbsp;=&nbsp;{{ oneBsvRate | cutLength }}&nbsp;BSV</span
        >
        <span v-else
          >1&nbsp;BSV&nbsp;=&nbsp;{{ oneFtRate | cutLength }}&nbsp;MC</span
        >
        <!-- <span>{{this.token1==='BSV'?$utils.thousandSeparator(recevice):$utils.thousandSeparator(from) }}&nbsp;TMC4 = {{this.token1==='BSV'?$utils.thousandSeparator(from):$utils.thousandSeparator(recevice)}}&nbsp;BSV</span> -->
      </div>
      <!-- <van-button
        type="info"
        :disabled='disableSwap'
        :loading="swapLoading"
        @click.stop=" appMetaIdJsV2 ? appToDetail() : toDetail()"
        loading-type="spinner"
        >{{$t('swap')}}</van-button
      > -->
      <van-button
        type="info"
        loading-type="spinner"
        :loading="swapLoading"
        @click.stop="appMetaIdJsV2 ? appToDetail() : toDetail()"
        >{{ $t("swap") }}</van-button
      >
      <!-- <van-button type="info" @click.stop="getSwapDetail">Swap123</van-button> -->
      <div class="detail">
        <!-- <div class="item">
          <span>{{ $t("minRecive") }}</span>
          <span
            >{{ minRecevice | cutLength }}&nbsp;{{
              this.token1 !== "BSV" ? "BSV" : toAccount.ftSymbol
            }}</span
          >
        </div> -->
        <div class="item">
          <span>{{ $t("slice") }}</span>
          <span>0.5%</span>
        </div>
        <div class="item">
          <span>{{ $t("impact") }}</span>
          <span :class="[priceFloat > 0 ? 'overPercent' : 'percent']">
            <van-icon name="arrow-left" v-if="priceFloat < 0.01" />
            <van-icon name="arrow" v-if="priceFloat > 100" />
            {{ priceFloat | limited }}%</span
          >
        </div>
        <div class="item">
          <span>{{ $t("fee") }}</span>
          <span
            >{{
              from >= 0.000002
                ? +from * (+initRateDate.swapFeeRate / 10000)
                : 0 | toDecimal
            }}&nbsp;{{ token1 === "BSV" ? "BSV" : "MC" }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { imgUrl, cutLength, toDecimal } from "@filters";
import {
  swapToken1ToToken2,
  swapToken2ToToken1,
  swapToken1ToToken2ByToken2,
  swapToken2ToToken1ByToken1,
} from "@utils/calcSwapFee";
export default {
  name: "Selection",
  components: {},
  data() {
    return {
      payToRecevice: "payToRecevice",
      receviceToPay: "receviceToPay",
      from: null,
      recevice: null,
      token2: "MC",
      token1: "BSV",
      selectFtToken: "MC",
      dialogShow: false,
      bsvDisable: false,
      ftDisable: false,
      isConfirm: false,
      newCoinList: [],
      ftList: [],
      swapLoading: false,
      coin: 0,
      swapRate: {},
      initRate: {},
      swapTxid: "",
      initAcount: 0,
      priceFloat: 0,
      oneFtRate: 0,
      oneBsvRate: 0,
      appMetaIdJsV2: {},
      initRateDate: {},
    };
  },
  mounted() {},
  computed: {
    ...mapState([
      "fromAccount",
      "toAccount",
      "userData",
      "PhoneShow",
      "appAccessToken",
    ]),
    // ...mapGetters(['isLogined']),
    inputPlace() {
      return `${this.$t("input")}`;
    },
    isInApp() {
      return window.appMetaIdJsV2;
    },
    appInit() {
      if (this.userData && this.PhoneShow) {
        return true;
      } else return false;
    },
    //BSV转聪
    bsvToSatoshis() {
      if (this.token1 === "BSV") {
        return (this.from * Math.pow(10, 9)) / 10;
      } else {
        return this.from;
      }
    },

    initCoin() {
      return this.coin;
    },
    minRecevice() {
      if (this.token1 === "BSV" && this.recevice > 0) {
        return this.recevice;
      } else {
        return this.recevice;
      }
    },
    fee() {
      if (this.initRateDate.txFee) {
        return +this.initRateDate.txFee / Math.pow(10, 8);
      } else {
        return 0;
      }
    },
    to() {
      return this.from;
    },
    accessToken() {
      return this.$cookies.get("access_token") || "";
    },
  },
  filters: {
    imgUrl,
    cutLength,
    toDecimal,
    cutZero(val) {
      return parseFloat(val);
    },
    limited(num) {
      if (num < 0) {
        return 0.01;
      } else if (num > 100) {
        return 100;
      } else {
        return num;
      }
    },
  },
  async activated() {
    if (this.userData && !window.appMetaIdJsV2) {
      await this.getBsvAccount();
      await this.getFtList();
      await this.initSwapRate();
      this.swapTxid = "";
      this.from = null;
      this.recevice = 0;
    } else {
      return;
    }
  },
  watch: {
    $route: {
      handler(to, from) {
        if (window.appMetaIdJsV2 && from && from.name === "Detail") {
          this.appGetBsvAccount();
          this.appGetFtList();
          this.appInitSwapRate();
          this.swapTxid = "";
          this.from = null;
          this.recevice = 0;
        }
      },
    },
    dialogShow: {
      handler(newVal) {
        if (newVal === false) {
          (this.bsvDisable = false), (this.ftDisable = false);
        }
      },
    },
    userData: {
      async handler(newVal) {
        if (newVal && !window.appMetaIdJsV2) {
          await this.getBsvAccount();
          await this.getFtList();
          await this.initSwapRate();
        }
      },
    },
    "$store.state.appAccessToken": {
      handler(newVal) {
        if (newVal !== "" && window.appMetaIdJsV2) {
          this.appGetBsvAccount();
          this.appGetFtList();
          this.appInitSwapRate();
        }
      },
    },
  },
  methods: {
    //计算恒定乘积
    mobility() {
      if (JSON.stringify(this.initRateDate) !== "{}") {
        let { swapToken1Amount, swapToken2Amount } = this.initRateDate;
      //恒定乘积计算方法：当前流动池LP为p,加入流动池后的LP为p1,固定公式(p1-p)/p 为对当前流动池LP的价格影响幅度
        if (this.token1 === "BSV") {
          let p = +(+swapToken1Amount / +swapToken2Amount);
          let p1 =
            (+swapToken1Amount + this.from * 10 ** 8) /
            (+swapToken2Amount -
              this.recevice * 10 ** +this.toAccount.ftDecimalNum);
          let k = (p1 - p) / p;
          return (this.priceFloat = Math.abs(k * 100).toFixed(2));
        } else {
          let q = +(+swapToken1Amount / +swapToken2Amount);
          let q1 =
            (+swapToken1Amount - +this.recevice * 10 ** 8) /
            (+swapToken2Amount +
              +this.from * 10 ** +this.toAccount.ftDecimalNum);
          let k2 = (q1 - q) / q;
          return (this.priceFloat = Math.abs(k2 * 100).toFixed(2));
        }
      } else {
        return (this.priceFloat = 0);
      }
    },
    //输入校验
    validator(value) {
      let decimal = +this.toAccount.ftDecimalNum;
      if (this.token1 === "BSV") {
        return value.match(/\d+.?\d{0,8}/);
      } else {
        return value.match(new RegExp(`\\d+.?\\d{0,${decimal}}`));
      }
    },
    //获取交易对恒定乘积的必要参数,LP,兑换手续费，项目费率
    async currentQuo(calcType) {
      if (!this.userData && (this.from || this.recevice)) {
        this.$toast.fail({
          message: `${this.$t("isLogin")}`,
          forbidClick: true,
          duration: 2000,
        });
        return;
      }
      this.from = this.validator(this.from);
      this.recevice = this.validator(this.recevice);
      const { projFeeRate, swapFeeRate, swapToken1Amount, swapToken2Amount } =
        this.initRateDate;
      if (this.token1 === "BSV") {
        if (calcType === "payToRecevice") {
          //bsv兑MC
           //通过token1计算出token2的输出数量
          let calcRecevice = swapToken1ToToken2(
            this.bsvToSatoshis, 
            swapToken1Amount, //token1输入数量
            swapToken2Amount, //token2输出数量
            swapFeeRate, //兑换手续费
            projFeeRate //项目手续费
          );
          this.recevice =
            BigInt(calcRecevice[0]).toString() /
            10 ** +this.toAccount.ftDecimalNum;
        } else if (calcType === "receviceToPay") {
          //bsv兑MC
          //通过token2计算出token1的输入数量
          let calcFrom = swapToken1ToToken2ByToken2(
            this.recevice * 10 ** +this.toAccount.ftDecimalNum,
            swapToken1Amount,
            swapToken2Amount,
            swapFeeRate,
            projFeeRate
          );
          this.from = BigInt(calcFrom[0]).toString() / 10 ** 8;
        }
        this.mobility();
      } else if (this.token1 !== "BSV") {
        //MC兑BSV
        //通过token2计算出token1的输入数量
        if (calcType === "payToRecevice") {
          let calcRecevice = swapToken2ToToken1(
            this.from * 10 ** +this.toAccount.ftDecimalNum,
            swapToken1Amount,
            swapToken2Amount,
            swapFeeRate,
            projFeeRate
          );
          this.recevice = BigInt(calcRecevice[0]).toString() / 10 ** 8;
        } 
         //MC兑BSV
        //通过token1计算出token2的输出数量
        else if (calcType === "receviceToPay") {
          let calcFrom = swapToken2ToToken1ByToken1(
            this.recevice * 10 ** 8,
            swapToken1Amount, 
            swapToken2Amount,
            swapFeeRate,
            projFeeRate
          );
          this.from =
            BigInt(calcFrom[0]).toString() / 10 ** +this.toAccount.ftDecimalNum;
        }
        this.mobility();
      } else {
        return;
      }
    },
    //app获取交易对恒定乘积
    async appCurrentQuo(calcType) {
      if (!this.userData && (this.from || this.recevice)) {
        this.$toast.fail({
          message: `${this.$t("isLogin")}`,
          forbidClick: true,
          duration: 2000,
        });
        return;
      }
      this.from = this.validator(this.from);
      this.recevice = this.validator(this.recevice);
      const { projFeeRate, swapFeeRate, swapToken1Amount, swapToken2Amount } =
        this.initRateDate;
      if (this.token1 === "BSV") {
        if (calcType === "payToRecevice") {
          let calcRecevice = swapToken1ToToken2(
            this.bsvToSatoshis,
            swapToken1Amount,
            swapToken2Amount,
            swapFeeRate,
            projFeeRate
          );
          this.recevice =
            BigInt(calcRecevice[0]).toString() /
            10 ** +this.toAccount.ftDecimalNum;
        } else if (calcType === "receviceToPay") {
          let calcFrom = swapToken1ToToken2ByToken2(
            this.recevice * 10 ** +this.toAccount.ftDecimalNum,
            swapToken1Amount,
            swapToken2Amount,
            swapFeeRate,
            projFeeRate
          );
          this.from = BigInt(calcFrom[0]).toString() / 10 ** 8;
        }
        this.mobility();
      } else if (this.token1 !== "BSV") {
        if (calcType === "payToRecevice") {
          let calcRecevice = swapToken2ToToken1(
            this.from * 10 ** +this.toAccount.ftDecimalNum,
            swapToken1Amount,
            swapToken2Amount,
            swapFeeRate,
            projFeeRate
          );
          this.recevice = BigInt(calcRecevice[0]).toString() / 10 ** 8;
        } else if (calcType === "receviceToPay") {
          let calcFrom = swapToken2ToToken1ByToken1(
            this.recevice * 10 ** 8,
            swapToken1Amount,
            swapToken2Amount,
            swapFeeRate,
            projFeeRate
          );
          this.from =
            BigInt(calcFrom[0]).toString() / 10 ** +this.toAccount.ftDecimalNum;
        }
        this.mobility();
      } else {
        return;
      }
    },
    //初始化交易对恒定乘积
    async initSwapRate() {
      this.initRateDate = await this.getInitSwapRate();
      const { swapToken1Amount, swapToken2Amount, swapFeeRate, projFeeRate } =
        this.initRateDate;
       //1MC兑换多小BSV
      this.oneFtRate = swapToken2Amount / swapToken1Amount;
       //1BSV兑换多小MC
      this.oneBsvRate = swapToken1Amount / swapToken2Amount;
    },
    async appInitSwapRate() {
      this.appGetInitSwapRate();
    },
    getInitSwapRate() {
      const symbol = "bsv-mc";
      return new Promise((resolve, reject) => {
        this.$store.state.metaidjs.swapreqswapargs({
          accessToken: this.accessToken,
          data: {
            symbol,
            
            op_code: this.token1 === "BSV" ? 3 : 4, //3代表Token1为bsv,Token2为Mc,BSV兑MC; 4代表Token1为bsv,Token2为Mc，MC兑BSV
          },
          callback: (res) => {
            if (res.data.code == 0) {
              this.initRate = res.data.data;
              resolve(this.initRate);
            } else {
              reject();
            }
          },
        });
      });
    },
    //app调用交易对发起交易前计算
    async appGetInitSwapRate() {
      const symbol = "bsv-mc";
      const op_code = this.token1 === "BSV" ? 3 : 4;

      window.appMetaIdJsV2.swapreqswapargs(
        this.appAccessToken,
        symbol,
        op_code,
        "appInitSwapreqswapargs"
      );
    },
    //app初始化交易对恒定乘积
    appInitSwapreqswapargs(res) {
      const result = JSON.parse(res);
      if (result.code == 0) {
        this.initRateDate = result.data;
        const { swapToken1Amount, swapToken2Amount, swapFeeRate, projFeeRate } =
          result.data;
       
        this.oneFtRate = swapToken2Amount / swapToken1Amount;
     
        this.oneBsvRate = swapToken1Amount / swapToken2Amount;
      }
    },
    // appSwapreqswapargs(res) {
    //   return new Promise((resolve, reject) => {
    //     const result = JSON.parse(res);
    //     if (result.code == 0) {
    //       this.initRateDate = result.data;

    //       resolve(this.initRateDate);
    //     } else {
    //       reject();
    //     }
    //   });
    // },
    //交易并跳转
    async toDetail() {
      if (!this.accessToken) {
        this.$toast.fail({
          message: `${this.$t("loginStatusLost")}`,
          forbidClick: true,
          duration: 3000,
        });
        this.swapLoading = false;
        return;
      }
      await this.initSwapRate();
      const {
        ftCodehash,
        ftGenesis,
        ftSymbol,
        ftSensibleId,
        ftBalance,
        ftDecimalNum,
      } = this.toAccount;

      if (!this.from || !this.recevice) {
        this.$toast.fail({
          message: `${this.$t("unBlank")}`,
          forbidClick: true,
          duration: 3000,
        });
        this.swapLoading = false;
        return;
      }
      if (+this.from > +ftBalance && this.token1 !== "BSV") {
        this.$toast.fail({
          message: `${this.$t("mcAmountEnough")}`,
          forbidClick: true,
          duration: 3000,
        });
        this.swapLoading = false;
        return;
      }
      if (+this.from > +this.fromAccount.bsv && this.token1 === "BSV") {
        this.$toast.fail({
          message: `${this.$t("bsvAmountEnough")}`,
          forbidClick: true,
          duration: 3000,
        });
        this.swapLoading = false;
        return;
      }
      try {
        const swap2symbol = ftSymbol.toLowerCase();
        const symbol = `bsv-mc`;
        const bsvOption = {
          amount:
            this.token1 === "BSV"
              ? +this.bsvToSatoshis
              : this.recevice * Math.pow(10, 8),
          codehash: "",
          genesisId: "",
        };
        const ftOption = {
          amount:
            this.token2 === "BSV"
              ? this.from * 10 ** +this.toAccount.ftDecimalNum
              : this.recevice * Math.pow(10, +this.toAccount.ftDecimalNum),
          codehash: ftCodehash,
          genesisId: ftGenesis,
          sensibleId: ftSensibleId,
        };

        this.swapLoading = true;
        //计算转账所需手续费，若不够就不进行交易
        if (this.token1 === "BSV" && this.initRateDate.op == 3) {
          let swapFee =
            bsvOption.amount +
            this.initRateDate.txFee +
            (bsvOption.amount * this.initRateDate.swapFeeRate) / 10000;
          if (swapFee > +this.fromAccount.bsv * 10 ** 8) {
            this.$toast.fail({
              message: this.$t("changeFeeNotEnought"),
              forbidClick: true,
              duration: 3000,
            });
            this.swapLoading = false;
            return;
          }
        } else {
          let swapFee = this.initRateDate.txFee;
          if (swapFee > +this.fromAccount.bsv * 10 ** 8) {
            this.$toast.fail({
              message: this.$t("changeFeeNotEnought"),
              forbidClick: true,
              duration: 3000,
            });
            this.swapLoading = false;
            return;
          }
        }

        this.$store.state.metaidjs.swapft({
          accessToken: this.accessToken,
          data: {
            symbol,
            op_code: this.token1 === "BSV" ? 3 : 4,
            token1: bsvOption,
            token2: ftOption,
            reqswapargs: this.initRateDate,
          },

          callback: (res) => {
            if (res.code == 200) {
              if (res.data?.code == 0) {
                this.swapLoading = false;
                this.swapTxid = res.data.swapTxid;
                this.toDetailPage();
              }
            } else {
              this.$toast.fail({
                message:
                  res.data.message.indexOf("swapft failed") !== -1
                    ? `${this.$t("bsvEnough")}`
                    : `${res.data.message}`,
                forbidClick: true,
                duration: 3000,
              });

              this.swapLoading = false;
            }
          },
        });
      } catch (error) {
        this.swapLoading = false;
        this.$toast.fail({
          message: this.$t("swapFails"),
          forbidClick: true,
          duration: 3000,
        });
        throw new Error(error);
      }
    },
    //app交易并跳转成功页面
    async appToDetail() {
      this.appInitSwapRate();

      const {
        ftCodehash,
        ftGenesis,
        ftSymbol,
        ftSensibleId,
        ftBalance,
        ftDecimalNum,
      } = this.toAccount;
      if (!this.from || !this.recevice) {
        this.$toast.fail({
          message: `${this.$t("unBlank")}`,
          forbidClick: true,
          duration: 3000,
        });
        this.swapLoading = false;
        return;
      }
      if (+this.from > +ftBalance && this.token1 !== "BSV") {
        this.$toast.fail({
          message: `${this.$t("mcAmountEnough")}`,
          forbidClick: true,
          duration: 3000,
        });
        this.swapLoading = false;
        return;
      }
      if (+this.from > +this.fromAccount.bsv && this.token1 === "BSV") {
        this.$toast.fail({
          message: `${this.$t("bsvAmountEnough")}`,
          forbidClick: true,
          duration: 3000,
        });
        this.swapLoading = false;
        return;
      }
      const swap2symbol = ftSymbol.toLowerCase();
      const symbol = `bsv-mc`;
      const bsvOption = {
        amount:
          this.token1 === "BSV"
            ? +this.bsvToSatoshis
            : this.recevice * Math.pow(10, 8),
        codehash: "",
        genesisId: "",
      };
      const ftOption = {
        amount:
          this.token2 === "BSV"
            ? this.from * 10 ** +this.toAccount.ftDecimalNum
            : this.recevice * Math.pow(10, +this.toAccount.ftDecimalNum),
        codehash: ftCodehash,
        genesisId: ftGenesis,
        sensibleId: ftSensibleId,
      };
      this.swapLoading = true;
      const op_code = this.token1 === "BSV" ? 3 : 4;
      const swapRate = this.initRateDate;
      if (this.token1 === "BSV" && this.initRateDate.op == 3) {
        let swapFee =
          bsvOption.amount +
          this.initRateDate.txFee +
          (bsvOption.amount * this.initRateDate.swapFeeRate) / 10000;
        if (swapFee > +this.fromAccount.bsv * 10 ** 8) {
          this.$toast.fail({
            message: this.$t("changeFeeNotEnought"),
            forbidClick: true,
            duration: 3000,
          });
          this.swapLoading = false;
          return;
        }
      } else {
        let swapFee = this.initRateDate.txFee;
        if (swapFee > +this.fromAccount.bsv * 10 ** 8) {
          this.$toast.fail({
            message: this.$t("changeFeeNotEnought"),
            forbidClick: true,
            duration: 3000,
          });
          this.swapLoading = false;
          return;
        }
      }
      window.appMetaIdJsV2.swapft(
        this.appAccessToken,
        symbol,
        op_code,
        JSON.stringify(bsvOption),
        JSON.stringify(ftOption),
        JSON.stringify(swapRate),
        "appToDetails"
      );
    },
    appToDetails(res) {
      let result;
      try {
        result = JSON.parse(res);
      } catch (err) {
        result = res;
        this.swapLoading = false;
      }

      if (result.code == 0) {
        this.swapLoading = false;
        this.swapTxid = result.swapTxid;
        this.toDetailPage();
      } else {
        this.swapLoading = false;
        this.$toast.fail({
          message:
            result.indexOf("swapft failed") !== -1
              ? `${this.$t("bsvEnough")}`
              : result?.message
              ? `${result.message}`
              : "token兑换失败",
          forbidClick: true,
          duration: 3000,
        });
      }
    },
    toDetailPage() {
      this.$router.push({
        name: "Detail",
        params: {
          from: {
            fromName: this.token1 === "BSV" ? "BSV" : this.toAccount.ftSymbol,
            fromBalance: this.from,
            fromIcon: this.token1 === "BSV" ? "BSVIcon" : this.toAccount.ftIcon,
          },
          to: {
            toName: this.token2 === "BSV" ? "BSV" : this.toAccount.ftSymbol,
            toBalance: this.recevice,
            toIcon: this.token2 === "BSV" ? "BSVIcon" : this.toAccount.ftIcon,
          },
          tx: this.swapTxid,
        },
      });
    },
  
    //切换Token
    async toggleCoin() {
      this.from = null;
      this.recevice = 0;
      this.priceFloat = 0;

      switch (this.token1) {
        case "BSV":
          this.token2 = this.token1;
          this.token1 = this.selectFtToken;
          this.appMetaIdJsV2
            ? this.appInitSwapRate()
            : await this.initSwapRate();

          break;
        case this.selectFtToken:
          this.token1 = this.token2;
          this.token2 = this.selectFtToken;
          this.appMetaIdJsV2
            ? this.appInitSwapRate()
            : await this.initSwapRate();

          break;
        default:
          break;
      }
    },

    openDialog(tokenType) {
      this.dialogShow = true;
      if (tokenType === "BSV") {
        this.bsvDisable = true;
      } else {
        this.ftDisable = true;
      }
    },
    //获取FT Token列表
    getFtList() {
      this.$store.state.metaidjs.getFTList({
        accessToken: this.accessToken,
        data: {},
        callback: (res) => {
          if (res.code == 200 && res.data.length) {
            this.ftList = res.data;
            let ftItem = this.ftList.filter((item) => {
              return item && item.ftName === "MetaCoin";
            });
            this.$store.dispatch("asyncSetToAccount", ...ftItem);
          }
        },
      });
    },
    //app获取FT Token列表
    appGetFtList() {
      window.appMetaIdJsV2.ftList(this.appAccessToken, "appGetFT");
    },
    appGetFT(res) {
      const result = JSON.parse(res);
      this.ftList = result;
      let ftItem = this.ftList.filter((item) => {
        return item && item.ftName === "MetaCoin";
      });
      this.$store.dispatch("asyncSetToAccount", ...ftItem);
    },

    // toggleFtList() {
    //   return new Promise((resolve) => {
    //     this.$store.state.metaidjs.getFTList({
    //       accessToken: this.accessToken,
    //       data: {},
    //       callback: async (res) => {
    //         if (res.code == 200 && res.data.length) {
    //           this.ftList = res.data;
    //           let ftItem = this.ftList.filter((item) => {
    //             return item.ftName || item.ftSymbol === this.selectFtToken;
    //           });
    //           await this.$store.dispatch("asyncSetToAccount", ...ftItem);

    //           resolve(this.toAccount);
    //         } else {
    //           resolve(this.toAccount);
    //         }
    //       },
    //     });
    //   });
    // },

    // appToggleFtList() {
    //   window.appMetaIdJsV2.ftList(this.appAccessToken, "toggleFt");
    // },

    //获取BSV余额
    getBsvAccount() {
      this.$store.state.metaidjs.getBalance({
        accessToken: this.accessToken,
        data: {},
        callback: (res) => {
          if (res.code == 200) {
            this.$store.dispatch("asyncSetFromAccount", res.data);
          }
        },
      });
    },
    //app获取BSV余额
    appGetBsvAccount() {
      window.appMetaIdJsV2.getBalance(this.appAccessToken, "getBsv");
    },
    getBsv(res) {
      const result = JSON.parse(res);

      if (result.code == 200) {
        let data = {};
        data.satoshi = 0;
        data.bsv = +result.data;
        this.$store.dispatch("asyncSetFromAccount", data);
      }
    },
  },

  created() {
    this.appMetaIdJsV2 = window.appMetaIdJsV2;
    if (window.appMetaIdJsV2) {
      window.getBsv = this.getBsv;
      window.toggleFt = this.toggleFt;
      window.appInitSwapreqswapargs = this.appInitSwapreqswapargs;
      window.appToDetails = this.appToDetails;
      window.appGetFT = this.appGetFT;
    }
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.selectionWrap {
  .top {
    padding-top: 0.857143rem /* 12/14 */;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #909399;
    font-size: 0.928571rem /* 13/14 */;
  }
  .foot {
    margin-top: 0.714286rem /* 10/14 */;
    padding: 0 0.857143rem /* 12/14 */;
    background-color: #f7f9fc;
    border-radius: 0.714286rem /* 10/14 */;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .van-cell {
      width: 28.571429rem /* 400/14 */;
      height: 4.714286rem /* 66/14 */;
      background-color: #f7f9fc;
      padding: 0.142857rem /* 2/14 */ /* 21/14 */ 0;
      font-size: 1.142857rem /* 16/14 */;
      // line-height: 4.714286rem /* 66/14 */;
      // text-align: center;
      display: flex;
      align-items: center;
    }
    ::v-deep .van-cell.van-field {
      .van-cell__value.van-cell__value--alone.van-field__value {
        .van-field__body {
          .van-field__control {
            height: 3.928571rem /* 55/14 */;
            display: flex;
            align-items: center;
            // max-width: 100%;
          }
        }
      }
    }
    .ftList {
      height: 2.714286rem /* 38/14 */;
      display: flex;
      align-items: center;
      background-color: #fff;
      border-radius: 0.357143rem /* 5/14 */;
      padding: 0 0.857143rem /* 12/14 */;
      i {
        color: #ffc051;
        font-size: 1.571429rem !important;
      }
      img {
        width: 1.571429rem /* 22/14 */;
        height: 1.571429rem /* 22/14 */;
        border-radius: 50%;
      }
      span {
        font-size: 0.928571rem /* 13/14 */;
        padding-left: 0.357143rem /* 5/14 */;
      }
    }
  }
  .PayDetailWrap {
    margin-top: 2.142857rem /* 30/14 */;
    .top {
      padding-top: 0.857143rem /* 12/14 */;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #909399;
      font-size: 0.928571rem /* 13/14 */;
    }
    ::v-deep .van-button.van-button--info.van-button--normal {
      background-color: #01bafb;
      border: 1px solid #01bafb;
      border-radius: 0.714286rem /* 10/14 */;
      width: 100%;
      margin-top: 0.785714rem /* 11/14 */;
      height: 4.285714rem /* 60/14 */;
      .van-button__content {
        .van-button__text {
          padding: 1.357143rem /* 19/14 */ 0;
          font-size: 1.142857rem /* 16/14 */;

          letter-spacing: 0.214286rem; /* 3/14 */
        }
      }
    }
    .detail {
      margin-top: 3.214286rem /* 45/14 */;
      color: #909399;
      font-size: 0.928571rem /* 13/14 */;
      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.714286rem /* 10/14 */;
        .percent {
          display: flex;
          align-items: center;

          color: #26a775;
        }
        .overPercent {
          display: flex;
          align-items: center;
          color: #fc6d5e;
        }
      }
    }
  }
  .selectionIcon {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;

    img {
      width: 2.142857rem /* 30/14 */;
      height: 2.142857rem /* 30/14 */;
      border-radius: 2.142857rem /* 30/14 */;
      cursor: pointer;
      &:active {
        box-shadow: 2px 2px 6px rgb(168, 167, 167);
      }
    }
  }
  .coinList {
    height: 50vh;
    .coinListWrap {
      padding: 0.714286rem /* 10/14 */;
      ::v-deep .van-list {
        .van-cell {
          &:hover {
            background-color: #f7f9fc;
          }
          .van-cell__value.van-cell__value--alone {
            padding: 10px 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .left {
              display: flex;
              align-items: center;
              i {
                color: #ffc051;
                font-size: 2.142857rem;
              }
              span {
                margin-left: 0.214286rem /* 3/14 */;
              }
              img {
                width: 2.142857rem /* 30/14 */;
                height: 2.142857rem /* 30/14 */;
                border-radius: 50%;
              }
            }
            .van-button.van-button--primary.van-button--mini {
              background-color: #01bafb;
              border: 1px solid #01bafb;
            }
          }
        }
      }
    }
  }
}
@media screen and (max-width: 500px) {
  .selectionWrap {
    .foot {
      .van-cell {
        width: 14.285714rem /* 200/14 */;
      }
    }
  }
}
</style>
