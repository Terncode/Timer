import React from "react";
import styled from 'styled-components';
import { compress } from "shrink-string";
import { isValid } from "./Time";

export interface Data {
    title: string;
    endMessage: string;
    date: string;
}

const Warper = styled.div`
    padding: 2vw;
    display: flex;
    flex-direction:column;
    input {
        margin: 5px;
    }
`


const Input = styled.input`
  border: 3px solid green;
  background: transparent;
  padding: 2px;
  color:white;
  outline: none;
`


interface State {
    time: string;
    date: string;
    loading: boolean;
}

interface Props {
    endMessage: string;
    title: string;
    date: Date;
    onTitleChange: (title: string) => void
    onEndMessageChange: (endMessage: string) => void
    onChange: (date:Date) => void;
}

export class DateTimePicker extends React.Component<Props, State> {
    constructor(props:Props) {
        super(props);
        const date = new Date();
        this.state = {
            time: this.getTimeString(date),
            date: this.getDateString(date),
            loading: false,
        }
    }
    componentDidMount()  {
        this.setState({
            time: this.getTimeString(this.props.date),
            date: this.getDateString(this.props.date),
        })
    }
    componentDidUpdate(props: Props) {
        if(this.props.date !== props.date) {
            this.setState({
                time: this.getTimeString(this.props.date),
                date: this.getDateString(this.props.date),
            })
        }
    }

    // input is retarded it won't anything it there is not nought at the beginning
    private numberToString = (number: number) => {
        return number < 10 ? `0${number}` : `${number}`
    }

    private getTimeString(date:Date) {
        const hours =   this.numberToString(date.getHours());
        const minutes = this.numberToString(date.getMinutes());
        const seconds = this.numberToString(date.getSeconds());
        return `${hours}:${minutes}:${seconds}`;
    }
    private getDateString(date:Date){
        const month = date.getMonth() + 1;
        const day = date.getDate();

        return `${date.getFullYear()}-${this.numberToString(month)}-${this.numberToString(day)}`;
    }

    updateTime = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({time: event.target.value});
    }

    updateDate = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({date: event.target.value});
        this.emitChange();
    }
    getDate() {
        const time = this.state.time.split(":").map(e => parseInt(e, 10));
        const date = this.state.date.split("-").map(e => parseInt(e, 10));
        const dateObj = new Date(date[0], date[1] -1, date[2], time[0], time[1], time[2]);
        return dateObj;
    }
    emitChange() {
        requestAnimationFrame(() => {
            this.props.onChange(this.getDate());
        })
    }
    genLink = async () => {
        if(this.state.loading) return;
        this.setState({loading: true})
        
        const pageLink = `${location.protocol}//${location.host}${location.pathname}`;
        const data: Data= {
            date: this.getDate().toISOString(),
            endMessage: this.props.endMessage,
            title: this.props.title,
        }
        const value = await compress(JSON.stringify(data));
        window.open(`${pageLink}?d=${encodeURI(value)}`, '_blank')


        this.setState({loading: false})
    }


    render() {
     return <Warper>
         <div>
            Event name
            <Input
            type="text" 
            value={this.props.title}
            onChange={ev => this.props.onTitleChange(ev.target.value)}
            />

         </div>

         Start Timer
         <Input type="time" value={this.state.time} onChange={this.updateTime}/>
         <Input type="date" value={this.state.date} onChange={this.updateDate}/>

        <div>
        End message
         <Input type="text" 
                  value={this.props.endMessage}
                  onChange={ev => this.props.onEndMessageChange(ev.target.value)}
         />

        </div>
        {isValid(this.getDate()) ? 
        <button className="btn btn-success" onClick={this.genLink}>Generate link</button>
        : null }
     </Warper>
    }
}

