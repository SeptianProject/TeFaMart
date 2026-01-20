import React from "react";

const TitleLanding: React.FC<{ name: string }> = ({ name }) => {
  return <h2 className="text-[28px] font-semibold">{name}</h2>;
};

export default TitleLanding;
