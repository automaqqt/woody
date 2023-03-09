import React from "react";
import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";
import { loadConfettiPreset } from "tsparticles-preset-confetti";

interface IProps {
    fire: boolean;
}

export default function Confetti({fire}:IProps) {
  // this customizes the component tsParticles installation
  
  const init = async (engine: Engine) => {
    await loadConfettiPreset(engine);
  };

  const options = {
    preset: "confetti",
  };
  if (fire) {
    return <Particles options={options} init={init} />;
  }
  return <></>
  
}