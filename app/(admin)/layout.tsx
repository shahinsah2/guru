import NavBar from "@/components/NavBar";
import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import PermissionsProvider from '@/context/PermissionsProvider';

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
      <PermissionsProvider>
      <main>{children}</main>
    </PermissionsProvider>
      </ClerkLoaded>
    </>
  );
}
