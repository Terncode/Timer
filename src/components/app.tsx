import React from "react";
import styled from 'styled-components';
import { Data, DateTimePicker } from './DatePicker'
import { Time } from "./Time";
import { decompress } from "shrink-string"


interface State {
    date: Date;
    title: string;
    endMessage: string;
    editable: boolean;
    previewEnd: boolean;
}

interface Props {

}

export class App extends React.Component<Props, State> {
    constructor(props:Props) {
        super(props);
        const date = new Date();
        date.setDate(date.getDate() + 1);

        this.state = {
            date,
            endMessage: 'End Message',
            title: 'Start Message',
            editable: false,
            previewEnd: false,
        }
    }

    async componentDidMount()  {
        const url = new URL(window.location.href);
        const searchParams = new URLSearchParams(url.search);
        let set = false
        if (searchParams.has("d")) {
            const value = searchParams.get("d");  
            try {
                const output = await decompress(value);
                const raw = JSON.parse(output) as Data;;
                if (raw.date) {
                    this.setState({
                        date: new Date(raw.date),
                        endMessage: raw.endMessage,
                        title: raw.title,
                        editable: false,
                    });
                    set = true;
                }
            } catch (error) {
                console.error("Unable to decode");
            }
        }
        if(!set) {
            console.log("e")
            this.setState({editable: true})
        }

    }

    componentWillUnmount() {
    
    } 
    updateDate = (date:Date) => {
        this.setState({ date })
    }

    datePicker = () => {
        if (!this.state.editable) return null;

        return  <><DateTimePicker 
        onChange={this.updateDate} 
        date={this.state.date}
        title={this.state.title} 
        endMessage={this.state.endMessage}
        onEndMessageChange={endMessage => this.setState({endMessage})}
        onTitleChange={title => this.setState({title})}
        />
        <button className="btn btn-secondary"
         onMouseDown={() => this.setState({previewEnd:true})}
         onMouseUp={() => this.setState({previewEnd:false})}
         
         onTouchStart={() => this.setState({previewEnd:true})}
         onTouchEnd={() => this.setState({previewEnd:false})}

         >Preview end</button>
        </>
    }

    render() {
     return <>

        {this.datePicker()}
        <Time date={this.state.date} title={this.state.title} endMessage={this.state.endMessage} end={this.state.previewEnd}/>
     </> 
    }
}

