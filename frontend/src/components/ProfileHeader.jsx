import { useState, useRef } from "react";
import { LogOutIcon, VolumeOffIcon, Volume2Icon, Loader2 } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");


function ProfileHeader() {
  const { logout, authUser, updateProfile, isUpdatingProfile } = useAuthStore();
  const { isSoundEnabled, toogleSound } = useChatStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return <div className="p-6 border-b border-slate-700/50">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* AVATAR */}
       <div className="avatar online">
        <button 
          className="size-11 rounded-full overflow-hidden relative group" 
          onClick={() => fileInputRef.current.click()}
          disabled={isUpdatingProfile} // disable click while updating
        >
          <img 
            src={selectedImg || authUser.profilePic || "/avatar.png"} 
            alt="User profile image" 
            className={`size-full object-cover ${isUpdatingProfile ? "opacity-50" : ""}`}
          />

          {/* Overlay when updating */}
          {isUpdatingProfile ? (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="animate-spin text-white size-5" />
            </div>
          ) : (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <span className="text-white text-xs">Change</span>
            </div>
          )}
        </button>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

        {/* USERNAME & Online Text */}
        <div>
          <h3 className="text-slate-200 font-medium text-base max-w-[180px] truncate">
            {authUser.fullname}
          </h3>

          <p className="text-xs text-slate-400">Online</p>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-4 items-center">
        {/* LogOut */}
        <button
          className="size-12 rounded-full overflow-hidden relative group bg-slate-800 flex items-center justify-end"
          onClick={logout}
        >
          {/* Icon */}
          <LogOutIcon className="size-5 text-slate-300" />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <span className="text-white text-xs">Logout</span>
          </div>
        </button>
        
        {/* SOUND TOGGLE BTN */}
        <button
          className="text-slate-400 hover:text-slate-200 transition-colors"
          onClick={() => {
            // play click sound before toggling
            mouseClickSound.currentTime = 0; // reset to start
            mouseClickSound.play().catch((error) => console.log("Audio play failed:", error));
            toogleSound();
          }}
        >
          {isSoundEnabled ? (
            <Volume2Icon className="size-5" />
          ) : (
            <VolumeOffIcon className="size-5" />
          )}
        </button>
        
      </div>  
    </div>
  </div>
  
}

export default ProfileHeader
