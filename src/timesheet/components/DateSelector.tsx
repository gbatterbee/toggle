import * as React from 'react';
import * as moment from 'moment';

interface DateSelectorProps {
    onDateChanged: (date: Date) => void;
}
interface DateSelectorState {
    dateTime: Date;
    initialDate: Date;
    offset: number;
    offsetText: string;
}
export default class DateSelector extends React.Component<DateSelectorProps, DateSelectorState> {
    constructor(props: DateSelectorProps) {
        super(props);
        const initialDate = this.getInitialDate();
        this.state = { initialDate, dateTime: initialDate, offset: 0, offsetText: this.getOffsetText() };
    }

    render() {
        var displayDate = moment(this.state.dateTime).format('DD.MM.YYYY');
        const offsetText = this.getOffsetText();
        return (
            <div>
                <button onClick={e => this.previousWeek()} >&lt;&lt;</button>
                <span>Week beginning {displayDate} ({offsetText})</span>
                <button onClick={e => this.nextWeek()} >&gt;&gt;</button>
            </div >
        );
    }

    getOffsetText() {
        if (this.state === undefined || this.state.offset === 0) {
            return 'this week';
        }

        if (this.state.offset < 0) {
            if (this.state.offset === -1) {
                return 'last week';
            }
            return `${this.state.offset * -1} weeks ago`;
        }

        if (this.state.offset === 1) {
            return 'next week';
        }
        return `${this.state.offset} weeks in the future`;

    }

    getInitialDate() {
        let initialDate = new Date(Date.now());
        initialDate.setDate(initialDate.getDate() - (initialDate.getDay() + 6) % 7);
        this.props.onDateChanged(initialDate);
        return initialDate;
    }

    previousWeek(): void {
        const dateTime = new Date(this.state.dateTime);
        dateTime.setDate(dateTime.getDate() - 7);
        this.setState({ dateTime, offset: this.state.offset - 1 });
        this.props.onDateChanged(dateTime);
    }

    nextWeek(): void {
        const dateTime = new Date(this.state.dateTime);
        dateTime.setDate(dateTime.getDate() + 7);
        this.setState({ dateTime, offset: this.state.offset + 1 });
        this.props.onDateChanged(dateTime);
    }
}