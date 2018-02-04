import * as React from 'react';

export interface TimeEntryChangedArgs {
    projectId: number;
    tagId: number;
    day: number;
    hours: number;
}

interface TimeSheetViewProps {
    entries: TimesheetEntry[];
    onTimeEntryChanged?: (period: TimeEntryChangedArgs) => void;
}

export interface TimesheetEntry {
    projectId: number;
    projectName: string;
    tagId: number;
    tagName: string;
    days: number[];
}

interface TimeSheetViewState {
}

export default class TimeSheetView extends React.Component<TimeSheetViewProps, TimeSheetViewState> {
    constructor(props: TimeSheetViewProps) {
        super(props);
    }

    render() {
        return (
            <div>
                test
            </div >
        );
    }
}