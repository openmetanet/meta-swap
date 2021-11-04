const utils = {
  thousandSeparator(input) {
    return (
      input &&
      input
        .toString()
        .replace(/(^|\s)\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ","))
    );
  },
  goShowMoney(url) {
    // 回调
    sessionStorage.removeItem("label");
    let httpUrl, id;
    // console.log(process.env.NODE_ENV)
    httpUrl = process.env.VUE_APP_httpUrl;
    id = process.env.VUE_APP_appClientId;
    // 注册
    // let tohttp = process.env.NODE_ENV === 'production' ? 'https://www.showmoney.app/wallet' : 'https://test.showmoney.io/wallet'
    // 第三方
    let SMhttp = process.env.VUE_APP_redirectUri + "/{{url}}";
    if (url === "login") {
      SMhttp = SMhttp.replace("{{url}}", "userLogin");
    } else {
      SMhttp = SMhttp.replace("{{url}}", "Matesign");
      // console.log(tohttp + '/sign?from=' + httpUrl)
    }
    // console.log(SMhttp + '?response_type=code&client_id=' + id +'&redirect_uri=' + httpUrl + '&scope=app&from=' + httpUrl)
    window.location.href =
      SMhttp +
      "?response_type=code&client_id=" +
      id +
      "&redirect_uri=" +
      httpUrl +
      "&scope=app&from=" +
      httpUrl;
  },
};

export default utils;
