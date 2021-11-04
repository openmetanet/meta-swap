const defaultImg=require("../assets/image/mcIcon.png")
export const imgUrl=txId=>{
    if (txId.indexOf("metafile://") != -1) {
        return (
          `${process.env.VUE_APP_IMGURL}${txId.replace("metafile://", "")}`
        );
      } else {
        return defaultImg;
      }
}

export const cutLength=(val)=>{
  if(val>0){
   return val.toFixed(8)
  }else{
    return val
  }
}

export const toDecimal=val=>{
  const e = String(val)
  let rex = /^([0-9]).?([0-9]*)e-([0-9])/
  if (!rex.test(e)) return val
  const numArr = e.match(rex)
  const n = Number('' + numArr[1] + (numArr[2] || ''))
  const num = '0.' + String(Math.pow(10, Number(numArr[3]) - 1)).substr(1) + n
  return num.replace(/0*$/, '') 
}
