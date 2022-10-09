import React from 'react';

type Props = {
  oddsInfos: Array<any>;
  selectOdds: Function;
};

const OddsCell: React.FC<Props> = (props) => {
  const { oddsInfos, selectOdds } = props;
  console.log('oddsInfos',oddsInfos)
  return (
    <div>
      {oddsInfos.map((info) => {
        <div>{info.scheme_title}2</div>;
      })}
    </div>
  );
};

export default OddsCell;
