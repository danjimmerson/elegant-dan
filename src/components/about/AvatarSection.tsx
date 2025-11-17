import professionalPhoto from "@/assets/dan-jimmerson-professional.png";
import { PinLine } from "./PinLine";
import { pinLineData } from "./pinLineData";

export const AvatarSection = () => {
  return (
    <div className="relative w-full max-w-4xl mx-auto h-[700px]">
      {/* SVG Canvas with Avatar and Lines */}
      <svg 
        className="w-full h-full"
        viewBox="0 0 900 700"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Avatar Image */}
        <image 
          href={professionalPhoto}
          x="225" 
          y="50"
          width="450"
          height="600"
          className="animate-fade-in"
          style={{
            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))',
          }}
        />
        
        {/* Pin Lines */}
        {pinLineData.map((data, index) => (
          <PinLine key={index} {...data} />
        ))}
      </svg>
    </div>
  );
};
