import { create } from "zustand";
export const useContent=create((set)=>({
contentType:"movies",
setcontenttype:(type)=>{
  set({contentType:type})
}
}))