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
    private worker: Worker;
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
        this.worker = new Worker('worker.js');
        const url = new URL(window.location.href);
        const searchParams = new URLSearchParams(url.search);
        let set = false
        if (searchParams.has("d")) {
            const value = searchParams.get("d");  
            try {
                const output = await decompress(value);
                const raw = JSON.parse(output) as Data;;
                if (raw.date) {
                    const date = new Date(raw.date);
                    this.setState({
                        date,
                        endMessage: raw.endMessage,
                        title: raw.title,
                        editable: false,
                    });
                    document.title = raw.title;
                    set = true;

                    if (date.getTime() < Date.now()) {
                        return;
                    }
                    
                    let notification = false;
                    (async () => {
                        const result = confirm("Do you want to be reminded?")
                        if (result) {
                            if (Notification.permission !== "granted") {
                                try {
                                    const result = await Notification.requestPermission()
                                    if (result === "granted") {
                                        notification = true;
                                    }
                                } catch (error) {
                                    console.error(error);
                                }
                            } else {
                                notification = true;
                            }
                        }
                    })()

                    this.worker.addEventListener("message", () => {
                        document.title = raw.endMessage;
                    })
                    this.worker.postMessage({date: raw.date, notification, title: raw.endMessage});
                }
            } catch (error) {
                console.error(error);
                console.error("Unable to decode");
            }
        }
        if(!set) {
            this.setState({editable: true})
        }

    }

    componentWillUnmount() {
        this.worker.terminate();
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

