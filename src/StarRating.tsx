import React, { useState, useEffect, useMemo, useRef } from "react";
import { calculateRating } from "./utils";
import styles from "./StarRating.module.css";

const StarRating = ({
  starsNumber = 5,
  onClick,
  incrementPrecision = 0.5,
  readonly = false,
  initialRate,
  starSize = 40,
  emptyColor = "silver",
  fillColor = "gold",
  hoverable = false,
  CustomIcon,
  customStyle,
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
  CustomIcon?: React.ComponentType<{
    size: number;
    color: string;
    style?: React.CSSProperties;
  }>;
  customStyle?: React.CSSProperties;
}) => {
  const [starRate, setStarRate] = useState<number>(initialRate || 0);
  const [temporaryRate, setTemporaryRate] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // starsNumberに渡す数値が0以下だと、そもそも画面に何も表示されなくなる。
    // そのため、starsNumberに渡す数値が0以下の際には、コンソールにエラーを出している
    if (starsNumber <= 0) {
      console.error(
        "starsNumberに無効になる数値が渡されています。1以上の数値を渡してください"
      );
    }

    // 初期値はアイコン(星)の数より大きいということはあり得ないので、その場合の警告を出している
    if (initialRate && initialRate > starsNumber) {
      console.error("初期値は星の数より小さい数値を渡してください");
    }
  }, [starsNumber, initialRate]);

  useEffect(() => {
    // 初期値の値を反映させるために再レンダリングを走らせている
    if (initialRate) {
      setStarRate(initialRate);
      onClick && onClick(initialRate)
    }
  }, [initialRate]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const { width, left } = ref.current?.getBoundingClientRect()!;
    const x = event.clientX - left;

    const newRate = calculateRating(x, width, starsNumber, incrementPrecision);

    setStarRate(newRate);

    if (onClick) {
      onClick(newRate);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { width, left } = ref.current?.getBoundingClientRect()!;
    const x = event.clientX - left;

    const newTemporaryRate = calculateRating(
      x,
      width,
      starsNumber,
      incrementPrecision
    );

    setTemporaryRate(newTemporaryRate);
  };

  const handleMouseLeave = () => {
    setTemporaryRate(null);
  };

  const widthPercent = useMemo(() => {
    if (hoverable && temporaryRate !== null) {
      return (temporaryRate / starsNumber) * 100 + "%";
    } else {
      return (starRate / starsNumber) * 100 + "%";
    }
  }, [starRate, starsNumber, temporaryRate]);

  return (
    <>
      <div
        ref={ref}
        onClick={readonly ? undefined : handleClick}
        onMouseMove={readonly || !hoverable ? undefined : handleMouseMove}
        onMouseLeave={readonly || !hoverable ? undefined : handleMouseLeave}
        className={styles.wrapper}
        style={readonly ? { cursor: "default" } : { cursor: "pointer" }}
      >
        <span>
          {[...Array(starsNumber)].map((_) => (
            <>
              {CustomIcon ? (
                <CustomIcon
                  size={starSize}
                  color={emptyColor}
                  style={customStyle}
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="-100 -100 200 200"
                  width={starSize}
                  height={starSize}
                  fill={emptyColor}
                  style={customStyle}
                >
                  <polygon points="0,-100 29.39,-40.45 95.11,-30.9 47.55,15.45 58.78,80.90 0,50 -58.78,80.9 -47.55,15.45 -95.11,-30.9 -29.39,-40.45" />
                </svg>
              )}
            </>
          ))}
        </span>

        <span
          className={styles.fillIcons}
          style={{
            width: widthPercent,
          }}
        >
          {[...Array(starsNumber)].map((_) => (
            <>
              {CustomIcon ? (
                <CustomIcon
                  size={starSize}
                  color={fillColor}
                  style={customStyle}
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="-100 -100 200 200"
                  width={starSize}
                  height={starSize}
                  fill={fillColor}
                  style={customStyle}
                >
                  <polygon points="0,-100 29.39,-40.45 95.11,-30.9 47.55,15.45 58.78,80.90 0,50 -58.78,80.9 -47.55,15.45 -95.11,-30.9 -29.39,-40.45" />
                </svg>
              )}
            </>
          ))}
        </span>
      </div>
    </>
  );
};

export default StarRating;
