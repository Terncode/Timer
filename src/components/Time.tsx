import React from "react";
import styled from 'styled-components';
import moment from 'moment'


const Center = styled.div`
  margin: auto;
  width: calc(100% - 12px);
  padding: 70px 0;
  border: 3px solid green;
  text-align: center;
  font-size: 8vw;
  h1 {
    font-size: 10vw;
  }
`

interface State {
 
}

interface Props {
    title: string;
    date: Date;
    endMessage: string;

    end: boolean;
}

export class Time extends React.Component<Props, State> {
    private timeout: any;
    constructor(props:Props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount()  {
        this.timeout = setInterval(() => this.forceUpdate(), 0);
    }

    componentWillUnmount() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    } 
    render() {
        if(!isValid(this.props.date) || this.props.end) {
            return <Center className="m-2">
            <h1>{this.props.title}</h1>
            <div>
                {this.props.endMessage}
            </div>
        </Center> 
        }

        const duration = moment.duration(this.props.date.getTime() - Date.now(), 'ms');
        const sec =  Math.round(duration.seconds());
        const min =   Math.round(duration.minutes());
        const hours = Math.round(duration.hours());
        
        const day = Math.round(duration.days());
        const months = Math.round(duration.months());
        const years = Math.round(duration.years());
        
        const dayString = day ? ` ${day} day${day !== 1 ? 's ' : ' '}` : ``; 
        const monthString = months ? ` ${months} month${months !== 1 ? 's ' : ' '}` : ``; 
        const yearString = years ? ` ${years} year${years !== 1 ? 's ' : ' '}` : ``; 
        
        const d = dayString || monthString || yearString ? `${dayString}${monthString}${yearString}` : '';

        const display = `${d ? `${d} and ` : ''}${hours}:${min}:${sec}`
        const date = this.props.date.toLocaleDateString();
        const time = this.props.date.toLocaleTimeString();
        return <Center className="m-2">
            <h1>{this.props.title}</h1>
            <div>
                {display}
            </div>
        <div className="bg-secondary">
            {date} {time}

        </div>
        </Center>
    }
}

export function isValid(date: Date) {
    return date.getTime() > Date.now()
}