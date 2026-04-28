import React, { useMemo } from 'react';

const colorChannelMixer = (colorChannelA: number, colorChannelB: number, amountToMix: number) => {
  let channelA = colorChannelA * amountToMix;
  let channelB = colorChannelB * (1 - amountToMix);
  return channelA + channelB;
};

const colorMixer = (rgbA: number[], rgbB: number[], amountToMix: number) => {
  let r = colorChannelMixer(rgbA[0], rgbB[0], amountToMix);
  let g = colorChannelMixer(rgbA[1], rgbB[1], amountToMix);
  let b = colorChannelMixer(rgbA[2], rgbB[2], amountToMix);
  return `rgb(${r}, ${g}, ${b})`;
};

const COLORS = {
  primaryColor: [69, 187, 219], // Cyan (#45BBDB)
  secondColor: [30, 34, 45],   // Deep Dark Blue
  dangerColor: [231, 76, 60],  // Red
};

const WeightBar: React.FC<{ percent: number; durability?: boolean }> = ({ percent, durability }) => {
  const color = useMemo(
    () =>
      durability
        ? // Durability: Lime (80) to Dark Red (0) with brighter mid-tones
          `hsl(${Math.min(80, (percent * 80) / 100)}, 85%, ${30 + (percent * 0.2)}%)`
        : // Weight: Cyan to Red as it gets heavy
          percent < 80
            ? colorMixer(COLORS.primaryColor, COLORS.primaryColor, 1)
            : colorMixer(COLORS.dangerColor, COLORS.primaryColor, (percent - 80) / 20),
    [durability, percent]
  );

  return (
    <div className={durability ? 'durability-bar' : 'weight-bar'}>
      <div
        style={{
          visibility: percent > 0 ? 'visible' : 'hidden',
          height: '100%',
          width: `${percent}%`,
          backgroundColor: color,
          transition: `background ${0.3}s ease, width ${0.3}s ease`,
        }}
      ></div>
    </div>
  );
};
export default WeightBar;
