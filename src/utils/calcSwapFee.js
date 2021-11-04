// 交换token1到token2时，通过token2的数量计算token1的数量
let FEE_FACTOR = 10000;
let MIN_TOKEN1_FEE = 600n;

// // 交换token1到token2时可获取的token2数量
export function swapToken1ToToken2(
  token1AddAmount,
  swapToken1Amount,
  swapToken2Amount,
  swapFeeRate,
  projFeeRate
) {
  token1AddAmount = BigInt(token1AddAmount);
  swapToken1Amount = BigInt(swapToken1Amount);
  swapToken2Amount = BigInt(swapToken2Amount);

  const token2RemoveAmount =
    (token1AddAmount * BigInt(FEE_FACTOR - swapFeeRate) * swapToken2Amount) /
    ((swapToken1Amount + token1AddAmount) * BigInt(FEE_FACTOR));

  let projFee = (token1AddAmount * BigInt(projFeeRate)) / BigInt(FEE_FACTOR);
  if (projFee < MIN_TOKEN1_FEE) {
    projFee = 0n;
  }
  return [token2RemoveAmount, projFee];
}

// // 交换token1到token2时，通过token2的数量计算token1的数量
export function swapToken1ToToken2ByToken2(
  token2RemoveAmount,
  swapToken1Amount,
  swapToken2Amount,
  swapFeeRate,
  projFeeRate
) {
  token2RemoveAmount = BigInt(token2RemoveAmount);
  swapToken1Amount = BigInt(swapToken1Amount);
  swapToken2Amount = BigInt(swapToken2Amount);

  const token1AddAmount =
    (token2RemoveAmount * BigInt(FEE_FACTOR) * swapToken1Amount) /
    (BigInt(FEE_FACTOR - swapFeeRate) * swapToken2Amount -
      token2RemoveAmount * BigInt(FEE_FACTOR));

  let projFee = (token1AddAmount * BigInt(projFeeRate)) / BigInt(FEE_FACTOR);
  if (projFee < MIN_TOKEN1_FEE) {
    projFee = 0n;
  }
  return [token1AddAmount, projFee];
}

// 交换token2到token1时可获取的token2数量
export function swapToken2ToToken1(
  token2AddAmount,
  swapToken1Amount,
  swapToken2Amount,
  swapFeeRate,
  projFeeRate
) {
  token2AddAmount = BigInt(token2AddAmount);
  swapToken1Amount = BigInt(swapToken1Amount);
  swapToken2Amount = BigInt(swapToken2Amount);
  const token1RemoveAmount =
    (token2AddAmount * BigInt(FEE_FACTOR - swapFeeRate) * swapToken1Amount) /
    ((swapToken2Amount + token2AddAmount) * BigInt(FEE_FACTOR));
  let projFee =
    (token2AddAmount * swapToken1Amount * BigInt(projFeeRate)) /
    ((swapToken2Amount + token2AddAmount) * BigInt(FEE_FACTOR));
  if (projFee < MIN_TOKEN1_FEE) {
    projFee = 0n;
  }
  return [token1RemoveAmount, projFee];
}

// // 交换token2到token1时, 通过token1的数量计算token2的数量
export function swapToken2ToToken1ByToken1(
  token1RemoveAmount,
  swapToken1Amount,
  swapToken2Amount,
  swapFeeRate,
  projFeeRate
) {
  token1RemoveAmount = BigInt(token1RemoveAmount);
  swapToken1Amount = BigInt(swapToken1Amount);
  swapToken2Amount = BigInt(swapToken2Amount);

  const token2AddAmount =
    (token1RemoveAmount * BigInt(FEE_FACTOR) * swapToken2Amount) /
    (BigInt(FEE_FACTOR - swapFeeRate) * swapToken1Amount -
      token1RemoveAmount * BigInt(FEE_FACTOR));

  let projFee =
    (token2AddAmount * swapToken1Amount * BigInt(projFeeRate)) /
    ((swapToken2Amount + token2AddAmount) * BigInt(FEE_FACTOR));
  if (projFee < MIN_TOKEN1_FEE) {
    projFee = 0n;
  }
  return [token2AddAmount, projFee];
}
