import clsx from "clsx";
import type { JSX } from "react";
import { facilities } from "../facilities";

type GameStatusProps = {
    isWon: boolean,
    isLost: boolean,
    isGameOver: boolean,
    lives: number
}

export default function GameStatus(props: GameStatusProps):JSX.Element  {
    const { isWon, isLost, isGameOver, lives} = props;

    //  Derived Values
    const facilityLostIdx: number = facilities.length - (lives + 1);
    
    return (
       <section 
            aria-live="polite" 
            role="status" 
            className={clsx('game-status', isWon && 'won', isLost && 'lost', (lives < 9 && !isGameOver) && 'damage')}
        >
            {isGameOver ? 
                (
                    isWon ? (
                    <>
                        <h2>🚀 Life-Support Rebooting 🚀</h2>
                        <p> You have saved the colony from certain doom.</p>
                    </>
                    ) : (
                    <>
                        <h2>⚫ Life-Support Failure ⚫</h2>
                        <p> The console makes a winding down hum followed by the LED lights dimming to black.</p>
                    </>
                    )
                ) : (
                    <p>{lives === 9 ? null : facilities[facilityLostIdx].message}</p>
                )
            }
        </section>
    )
}