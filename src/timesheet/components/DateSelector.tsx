import * as React from 'react';
import * as moment from 'moment';

interface DateSelectorProps {
    onDateChanged: (date: Date) => void;
}
interface DateSelectorState {
    dateTime: Date;
}
export default class DateSelector extends React.Component<DateSelectorProps, DateSelectorState> {
    constructor(props: DateSelectorProps) {
        super(props);
        this.state = { dateTime: this.getInitialDate() };
    }

    render() {
        var displayDate = moment(this.state.dateTime).format('DD.MM.YYYY');

        return (
            <div>
                <button onClick={e => this.previousWeek()} >&lt;&lt;</button>
                <span>{displayDate}</span>
                <button onClick={e => this.nextWeek()} >&gt;&gt;</button>
            </div >
        );
    }

    getInitialDate() {
        let initialDate = new Date(Date.now());
        initialDate.setDate(initialDate.getDate() - (initialDate.getDay() + 6) % 7);
        return initialDate;
    }

    previousWeek(): void {
        const dateTime = new Date(this.state.dateTime);
        dateTime.setDate(dateTime.getDate() - 7);
        this.setState({ dateTime });
        this.props.onDateChanged(dateTime);
    }

    nextWeek(): void {
        const dateTime = new Date(this.state.dateTime);
        dateTime.setDate(dateTime.getDate() + 7);
        this.setState({ dateTime });
        this.props.onDateChanged(dateTime);
    }
}