//@/layout.jsx

import NavBar from "@/components/NavBar";
import {TanstackProvider} from '@/components/providers/tanstack-provider';
import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";

export default function Layout({children}) {
  return (
    <>
     <ClerkLoading>
      <h1>Loading...</h1>
    </ClerkLoading>
    <ClerkLoaded>
      <NavBar />       
      
      <main><TanstackProvider>{children}</TanstackProvider></main>
    
      </ClerkLoaded>
    </>
  );
}
