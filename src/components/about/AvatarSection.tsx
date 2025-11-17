import professionalPhoto from "@/assets/dan-jimmerson-professional.png";
import { PinLine } from "./PinLine";
import { pinLineData } from "./pinLineData";

export const AvatarSection = () => {
  return (
    <div className="relative w-full max-w-4xl mx-auto h-[700px] flex items-center justify-center">
      {/* SVG Canvas for Lines */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 900 700"
        preserveAspectRatio="xMidYMid meet"
      >
        {pinLineData.map((data, index) => (
          <PinLine key={index} {...data} />
        ))}
      </svg>

      {/* Avatar Image */}
      <div className="relative z-10">
        <img 
          src={professionalPhoto}
          alt="Dan Jimmerson - Marketing Executive"
          className="h-[600px] w-auto object-contain animate-fade-in"
          style={{
            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))',
          }}
        />
      </div>
    </div>
  );
};
