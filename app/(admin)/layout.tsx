import NavBar from "@/components/NavBar";
import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";

export default function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <>
     <ClerkLoading>
      <h1>Loading...</h1>
    </ClerkLoading>
    <ClerkLoaded>
      <NavBar />       
      
      <main>{children}</main>
    
      </ClerkLoaded>
    </>
  );
}
