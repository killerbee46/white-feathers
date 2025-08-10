import { Metadata } from "next";
import UserLayout from "../layouts/UserLayout";

export const metadata: Metadata = {
  title: "White Feather's Jewellery",
  description: "This is the official site of White Feather's Jewellery.",
};

export default function Home() {
  return (
    <UserLayout>
      Home page 
    </UserLayout>
  );
}
