import {create} from 'zustand'
import axiosInstance from '../lib/axios.js'
import toast from 'react-hot-toast';


export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggningIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check")
      set({ authUser: res.data.user})
    } catch (error) {
      console.log("Error checking auth:", error)
      set({ authUser: null})
    }
    finally {
      set({ isCheckingAuth: false })
    }
  },
  signup : async (data) => {
    set({ isSigningUp: true })
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data});

      //toast success message
      toast.success("Signup successful!")

    } catch (error) {
      toast.error(error.response.data.message)
    }
    finally {
      set({ isSigningUp: false })
    }
  },

  login : async (data) => {
    set({ isLoggningIn: true })
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data});

      //toast success message
      toast.success("Logged In successful")

    } catch (error) {
      toast.error(error.response.data.message)
    }
    finally {
      set({ isLoggningIn: false })
    }
  },

  logout : async () => {
      try {
        await axiosInstance.post("/auth/logout");
        set({ authUser: null });
        toast.success("Logged out successfully");
      } catch (error) {
        toast.error("Error logging out. Please try again."),
        console.log("Error logging out:", error)
      }
  },

  updateProfile : async (data) => {
    set({ isUpdatingProfile: true })
    try {
      const res = await axiosInstance.put("/auth/update_profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully")
    } catch (error) {
      console.log("Error updating profile:", error);
      toast.error(error.response.data.message);
    }
    finally {
      set({ isUpdatingProfile: false })
    }
  }
}));