import professionalPhoto from "@/assets/dan-jimmerson-professional.png";
import { AttributeChip } from "./AttributeChip";
import { attributeData } from "./attributeData";

export const AvatarSection = () => {
  return (
    <div className="relative w-full max-w-4xl mx-auto h-[800px] flex items-center justify-center">
      {/* Avatar Image */}
      <div className="relative z-20">
        <img
          src={professionalPhoto}
          alt="Dan Jimmerson - Marketing Executive"
          className="h-[700px] w-auto object-contain animate-fade-in"
          style={{
            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))',
          }}
        />
      </div>

      {/* Attribute Chips */}
      {attributeData.map((data, index) => (
        <AttributeChip key={index} {...data} />
      ))}
    </div>
  );
};
