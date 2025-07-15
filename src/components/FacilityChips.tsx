import type { JSX } from "react";
import type { Facility } from "../types";
import clsx from "clsx";
import { facilities } from '../facilities'

export default function FacilityChips(props: { lives: number; }):JSX.Element  {
    const { lives } = props
    const facilitiesElem:JSX.Element[] = facilities.map((facility:Facility, idx:number):JSX.Element => {
    const styles = {
      backgroundColor: facility.backgroundColor,
      color: facility.color
    }
    return (
      <span 
        key={facility.name} 
        className={clsx({chip:true, lost:idx < facilities.length - lives})}
        style={styles}>{facility.name}
      </span>
    )
  });

    return (
        <section className="facility-chips">
            {facilitiesElem}
        </section>
    )
}