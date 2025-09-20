import { create } from "zustand";
import { persist } from "zustand/middleware";

// 10초(ms) 후 적용
const APPLY_DELAY = 30 * 1000;
// 중복 타이머 방지 핸들
let sfTimer: ReturnType<typeof setTimeout> | null = null;
interface AuthStore 
{ 
    userEmailId: string;
    setEmailId: (userEmailId: string) => void;
    password: string;
    setPassword: (password: string) => void;
    nickname: string;
    setNickname: (nickname: string) => void;
    userTelNumber: string;
    setUserTelNumber: (userTelNumber: string) => void;
    authNumber: string;
    setAuthNumber: (authNumber: string) => void;
    userAddress: string;
    setUserAddress: (userAddress: string) => void;
    userName: string;
    setUserName: (userName: string) => void;
    joinPath: string;
    setJoinPath: (joinPath: string) => void;
    snsId: string | undefined;
    setSnsId: (snsId: string | undefined) => void;
    SFcount: number;
    setSFcount: (SFcount: number) => void;
    tempAccessToken: string;
    setTempAccessToken : (SFcount: string) => void;
}

const useAuthStore = create<AuthStore>()(
    persist(
    (set,get) => ({

    userEmailId: '',
    setEmailId: (userEmailId: string) => set(state => ({ ...state, userEmailId})),

    password: '',
    setPassword: (password: string) => set(state => ({ ...state, password})),

    nickname: '',
    setNickname: (nickname: string) => set(state => ({ ...state, nickname})),

    userTelNumber: '',
    setUserTelNumber: (userTelNumber: string) => set(state => ({ ...state, userTelNumber})),

    authNumber: '',
    setAuthNumber: (authNumber: string) => set(state => ({ ...state, authNumber})),

    userAddress: '',
    setUserAddress: (userAddress: string) => set(state => ({ ...state, userAddress})),
    
    userName: '',
    setUserName: (userName: string) => set(state => ({...state, userName})),

    joinPath: 'HOME',
    setJoinPath: (joinPath: string) => set(state => ({...state, joinPath})),
    
    snsId: undefined,
    setSnsId: (snsId: string | undefined) => set(state => ({...state, snsId})),
    
    tempAccessToken: '',
    setTempAccessToken: (tempAccessToken: string) => set(state => ({...state, tempAccessToken})),

    SFcount: 0,
    setSFcount: (SFcount: number) => 
    {
        const current = get().SFcount;
        if(current<5) 
        {
          set(state => ({ ...state, SFcount }));
        }
        else if(current>=5)
        {
        
          if (sfTimer) clearTimeout(sfTimer);       
          sfTimer =
          setTimeout(() => 
          {               
            set(state => ({ ...state, SFcount }));
            sfTimer = null;
          }, APPLY_DELAY);
        }
    },
    }),
    {
      name: "auth-store", 
      partialize: (state) => ({ SFcount: state.SFcount }),
    }
))  

export default useAuthStore;
/* /분석 완료/ */