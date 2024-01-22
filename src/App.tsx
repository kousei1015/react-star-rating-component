import { useState } from "react";
import StarRating from "./StarRating";
const App = () => {
  const [star, setStar] = useState(0);

  const clickStar = (rate: number) => {
    setStar(rate);
  };


  return (
    <div>
      <StarRating
        onClick={clickStar}
        hoverable={true}
      />

      {/* 下のspanタグの「{star}」は、数値を表示させるために記述 */}
      <span>{star}</span>
    </div>
  );
};

export default App;
