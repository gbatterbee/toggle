import * as React from 'react';

interface TimeSheetViewProps {
    entries: TimesheetEntry[];
}

export class TimesheetEntry {
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