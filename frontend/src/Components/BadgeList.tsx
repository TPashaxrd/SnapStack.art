interface Badge {
    name: string;
    awardedAt: string;
    expiresAt?: string;
  }
  
  interface BadgeListProps {
    badges: Badge[];
  }
  
  const badgeThemes: Record<string, string> = {
    "Bronze": "bg-[#cd7f32] text-white",
    "Silver": "bg-slate-400 text-black",
    "Gold": "bg-yellow-400 text-black",
    "Platinum": "bg-purple-400 text-white",
    "Diamond": "bg-blue-400 text-white",
    "Legendary": "bg-red-500 text-white",
  };
  
  export default function BadgeList({ badges }: BadgeListProps) {
    return (
      <div className="flex flex-wrap gap-2">
        {badges
          ?.filter(badge => badge.name !== "New User")
          .map((badge) => {
            const type = badge.name.includes("#") ? badge.name.split(" ")[0] : badge.name;
            const theme = badgeThemes[type] || "bg-gray-500 text-white";
  
            return (
              <span
                key={badge.name}
                className={`flex gap-1 px-3 py-1 rounded-full select-none text-sm font-semibold border border-gray-800/50 hover:scale-105 transition-all duration-300 shadow-lg ${theme}`}
              >
                {badge.name}
              </span>
            );
          })}
      </div>
    );
  }
  