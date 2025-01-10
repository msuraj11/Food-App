import Link from "next/link";
import Image from "next/image";
import logoImg from "@/assets/logo.png";
import classes from "./main-header.module.css";

export default function MealsHeader() {
  return (
    <header className={classes.header}>
      <Link className={classes.logo} href="/">
        <Image src={logoImg} alt="An image with food in a plate." priority />
        NextLevel Food
      </Link>
      <nav className={classes.nav}>
        <ul>
          <li>
            <Link href="/meals">Meals</Link>
          </li>
          <li>
            <Link href="/community">Community</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
