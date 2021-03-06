import * as React from 'react';
import { Grid, Input } from 'semantic-ui-react';
import { DayNames, Day } from '../models/enums';
import { TimesheetEntry, TimeChangedArgs, DescriptionChangedArgs } from './models';
import RemoveableHeader from './RemoveableHeader';

export const TagView = ({ tag, onTimeChanged, onDescriptionChanged, onRemove }:
    {
        tag: TimesheetEntry;
        onDescriptionChanged: (description: DescriptionChangedArgs) => void;
        onTimeChanged: (period: TimeChangedArgs) => void;
        onRemove: (tagId: string) => void;
    }) => (
        <>
        <RemoveableHeader
            as="h4"
            title={tag.tagName}
            onRemove={() => onRemove(tag.tagId)}
            align="left"
        />

        <Grid columns={5} stackable>
            {
                DayNames.map(d => {
                    const day: any = tag.days[Day[d]] || {};
                    return (
                        <Grid.Column key={d}>
                            <Input
                                type="time"
                                defaultValue={day.time}
                                onChange={(evt) => {
                                    onTimeChanged({
                                        tagId: tag.tagId,
                                        projectId: tag.projectId,
                                        day: Day[d],
                                        hours: evt.currentTarget.value
                                    });
                                }
                                }
                            />
                            <Input
                                type="text"
                                placeholder="description"
                                defaultValue={day.description}
                                onChange={(evt) => {
                                    onDescriptionChanged({
                                        tagId: tag.tagId,
                                        projectId: tag.projectId,
                                        description: evt.currentTarget.value,
                                        day: Day[d],
                                    });
                                }
                                }
                            />
                        </Grid.Column>
                    );
                })
            }
        </Grid>
        </>
    );
