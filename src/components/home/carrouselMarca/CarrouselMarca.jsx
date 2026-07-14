import React from "react";
import s from "./CarrouselMarca.module.css";

import gestya from '../../../assets/brands/gestya.png';
import fulmar from '../../../assets/brands/fulmar.png';
import rutatrol from '../../../assets/brands/rutatrol.png';
import viesa from '../../../assets/brands/viesa.png';
import vdo from '../../../assets/brands/vdo.png';
import racetruck from '../../../assets/brands/racetruck.png';
import vitran from '../../../assets/brands/vitran.png';
import airtronic from '../../../assets/brands/airtronic.png';
import voryl from '../../../assets/brands/voryl.png';
import colven from '../../../assets/brands/colven.png';


function CarrouselMarca() {
    const logos = [
        gestya, fulmar, rutatrol, viesa, vdo, racetruck, vitran, airtronic, voryl, colven
    ];

    const totalBrands = logos.length;
    const animationDuration = `${totalBrands * 3}s`;

    return (
        <section>
            <div
                className={s.slider}
                style={{
                    "--total-brand": totalBrands,
                    "--animation-duration": animationDuration,
                }}
            >
                <ul className={s.brands}>
                    {logos.map((logo, index) => (
                        <li key={index} className={s.brandLogo}>
                            <img src={logo} alt={`Logo ${index}`} />
                        </li>
                    ))}
                    {logos.map((logo, index) => (
                        <li key={`duplicate-${index}`} className={s.brandLogo} aria-hidden="true">
                            <img src={logo} alt="" />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

export default CarrouselMarca;

