import { useRef, useReducer, useMemo, useEffect } from "react";
import styles from "./StarRating.module.css";

const StarRating = ({
  starsNumber = 5,
  onClick,
  incrementPrecision = 0.5,
  readonly = false,
  initialRate,
  starSize = 40,
  emptyColor = "black",
  fillColor = "yellow",
  hoverable = false,
}: {
  starsNumber?: number;
  onClick?: (rate: number) => void;
  incrementPrecision?: 0.1 | 0.5 | 1;
  readonly?: boolean;
  initialRate?: number | undefined;
  starSize?: number;
  emptyColor?: string;
  fillColor?: string;
  hoverable?: boolean;
}) => {
  const starRef = useRef<number>(initialRate ? initialRate : 0);
  const temporaryRef = useRef<number | null>(0);
  const forceUpdate = useReducer(() => ({}), {})[1];
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // starsNumberに渡す数値が0以下だと、そもそも画面に何も表示されなくなる。
    // そのため、starsNumberに渡す数値が0以下の際には、コンソールにエラーを出している
    if (starsNumber <= 0) {
      console.error(
        "starsNumberに無効になる数値が渡されています。1以上の数値を渡してください"
      );
    }

    // 初期値の値を反映させるために再レンダリングを走らせている
    if (initialRate) {
      starRef.current = initialRate;
      onClick ? onClick(starRef.current) : forceUpdate();
    }

    // 初期値はアイコン(星)の数より大きいということはあり得ないので、その場合の警告を出している
    if (initialRate && initialRate > starsNumber) {
      console.error("初期値は星の数より小さい数値を渡してください");
    }
  }, [starsNumber, initialRate]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const { width, left } = ref.current?.getBoundingClientRect()!;

    const x = event.clientX - left;

    // 以下の条件文は細かさの調整をしている
    // 0.5の場合は0.5刻みの数値(「1.5」、「2.0」、「2.5」といった数値)
    // 1の場合は1刻みの数値(「1」、「2」、「3」といった数値)
    // 0.1の場合は0.1刻みの数値(「1.1」、「1.3」といった数値)に変更することができる
    if (incrementPrecision === 0.5) {
      starRef.current = Math.round((x / width) * starsNumber * 2) / 2;
    } else if (incrementPrecision === 1) {
      starRef.current = Math.round((x / width) * starsNumber);
    } else if (incrementPrecision === 0.1) {
      starRef.current = Math.round((x / width) * starsNumber * 10) / 10;
    }

    debugger;

    // 以下は再レンダリングを走らせるための処理
    if (onClick) {
      onClick(starRef.current);
    } else {
      forceUpdate();
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { width, left } = ref.current?.getBoundingClientRect()!;
    const x = event.clientX - left;

    if (incrementPrecision === 0.5) {
      temporaryRef.current = Math.round((x / width) * starsNumber * 2) / 2;
    } else if (incrementPrecision === 1) {
      temporaryRef.current = Math.round((x / width) * starsNumber);
    } else if (incrementPrecision === 0.1) {
      temporaryRef.current = Math.round((x / width) * starsNumber * 10) / 10;
    }
    forceUpdate();
  };

  const handleMouseLeave = () => {
    temporaryRef.current = null;
    forceUpdate();
  };

  const widthPercent = useMemo(() => {
    if (temporaryRef.current !== null) {
      return (temporaryRef.current / starsNumber) * 100 + "%";
    } else {
      return (starRef.current / starsNumber) * 100 + "%";
    }
  }, [starRef.current, starsNumber, temporaryRef.current]);

  return (
    <>
      <div
        ref={ref}
        onClick={readonly ? undefined : handleClick}
        onMouseMove={readonly || !hoverable ? undefined : handleMouseMove}
        onMouseLeave={readonly || !hoverable ? undefined : handleMouseLeave}
        className={styles.star}
        style={readonly ? { cursor: "default" } : { cursor: "pointer" }}
      >
        <span style={{ color: "rgb(204, 204, 204)" }}>
          {[...Array(starsNumber)].map((_, index) => (
            <svg
              key={index}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-100 -100 200 200"
              width={starSize}
              height={starSize}
              fill={emptyColor}
            >
              <polygon points="0,-100 29.39,-40.45 95.11,-30.9 47.55,15.45 58.78,80.90 0,50 -58.78,80.9 -47.55,15.45 -95.11,-30.9 -29.39,-40.45" />
            </svg>
          ))}
        </span>

        <span
          className={styles.fullIcons}
          style={{
            width: widthPercent,
          }}
        >
          {[...Array(starsNumber)].map((_, index) => (
            <svg
              key={index}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-100 -100 200 200"
              width={starSize}
              height={starSize}
              fill={fillColor}
            >
              <polygon points="0,-100 29.39,-40.45 95.11,-30.9 47.55,15.45 58.78,80.90 0,50 -58.78,80.9 -47.55,15.45 -95.11,-30.9 -29.39,-40.45" />
            </svg>
          ))}
        </span>
      </div>
    </>
  );
};

export default StarRating;
