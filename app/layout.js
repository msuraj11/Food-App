import "./globals.css";
import LayoutBackground from "@/components/layout-background";
import MealsHeader from "@/components/meals-header";

export const metadata = {
  title: "NextLevel Food",
  description: "Delicious meals, shared by a food-loving community.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LayoutBackground />
        <MealsHeader />
        {children}
      </body>
    </html>
  );
}
