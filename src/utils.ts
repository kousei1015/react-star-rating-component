export const calculateRating = (
  x: number,
  width: number,
  starsNumber: number,
  precision: number
) => {
  // 以下のfactor定数は数値の細かさの調整をしている
  // 0.5の場合は0.5刻みの数値(「1.5」、「2.0」、「2.5」といった数値)
  // 1の場合は1刻みの数値(「1」、「2」、「3」といった数値)
  // 0.1の場合は0.1刻みの数値(「1.1」、「1.3」といった数値)に変更することができる
  const factor = precision === 0.1 ? 10 : precision === 0.5 ? 2 : 1;
  return Math.round((x / width) * starsNumber * factor) / factor;
};
