import professionalPhoto from "@/assets/dan-jimmerson-professional.png";

export const AvatarSection = () => {
  return (
    <div className="relative w-full h-[400px] flex items-center justify-center">
      <div className="relative">
        <img 
          src={professionalPhoto}
          alt="Dan Jimmerson - Marketing Executive"
          className="h-[400px] w-auto object-contain"
          style={{
            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))',
          }}
        />
      </div>
    </div>
  );
};
