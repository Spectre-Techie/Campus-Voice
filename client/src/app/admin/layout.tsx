import { AuthProvider } from "@/hooks/use-auth";

export const metadata = {
  title: "Admin | CampusVoice",
};

export default function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
