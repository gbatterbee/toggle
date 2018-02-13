import * as React from 'react';
import { Grid } from 'semantic-ui-react';
export const HoursSummary = ({ dailySummaries }:
    {
        dailySummaries: string[];
    }) => {
    return (
        < Grid columns={5} stackable >
            {
                dailySummaries.map((d, i) => (
                    <Grid.Column key={i}>
                        <span>{d}</span>
                    </Grid.Column>
                )                )
            }
        </Grid >
    );
};