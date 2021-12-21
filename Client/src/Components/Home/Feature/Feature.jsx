/***
 * Copyright (C) Rodolfo Herrera Hernandez. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project root
 * for full license information.
 *
 * =+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
 *
 * For related information - https://github.com/CodeWithRodi/Cutternet/
 *
 * Cutternet Client Source Code
 *
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
 ****/
import React from 'react';
import Accordion from '../../General/Accordion/Accordion';
import './Feature.css';

const Feature = ({ Image, Alt, Title, Content }) => {
    return (
        <div className="Generic-Feature">
            <figure>
                <img src={Image} alt={Alt} />
                <figcaption>
                    <div className="Display-On-Desktop">
                        <h3>{Title}</h3>
                        <p>{Content}</p>
                    </div>
                    <div className="Display-On-Mobile">
                        <Accordion Title={Title} Expanded={true} Content={<p>{Content}</p>} />
                    </div>
                </figcaption>
            </figure>
        </div>
    );
};

export default Feature;
