import React from 'react';
import { Grid, IconButton } from '@mui/material';

const IconText = ({ children, Icon, Text, ApplyScreenAdapter = false }) => {
    return ApplyScreenAdapter ? (
        <>
            <div className="Display-On-Desktop">
                <Grid className="Icon-Link" container justify="center">
                    <i>{Icon}</i>
                    <span>{Text}</span>
                </Grid>
            </div>
            <div className="Display-On-Mobile">
                <IconButton size="small">
                    <i>{Icon}</i>
                </IconButton>
            </div>
        </>
    ) : (
        <Grid className="Icon-Link" container justify="center">
            <i>{Icon}</i>
            <span>{Text}</span>
        </Grid>
    );
};

export default IconText;
