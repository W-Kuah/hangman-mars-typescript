import type { JSX } from "react";

export default function Header():JSX.Element  {
    
    return (
       <header>
          <h1>MARS Systems Reboot</h1>
          <p>Guess the code to restore life-support systems using the key pad. Previous codes: <b>LIZARD</b>, <b>VAULTING</b> and <b>PASSWORD</b>. You have <u>9 chances!</u> Use the hints at high cost to the facilities' integrity.</p>
        </header>
    )
}