import React from "react";
import styled from 'styled-components';
import { Data, DateTimePicker } from './DatePicker'
import { Time } from "./Time";
import { decompress } from "shrink-string"
import { Popup } from "./popup";


interface State {
    date: Date;
    title: string;
    endMessage: string;
    editable: boolean;
    previewEnd: boolean;
    reminderPopup: boolean;
}

interface Props {

}

export class App extends React.Component<Props, State> {
    private worker: Worker;
    private raw: Data;
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
            reminderPopup: false,
        }
    }

    async componentDidMount()  {
        this.worker = new Worker('worker.js');
        const url = new URL(window.location.href);
        const searchParams = new URLSearchParams(url.search);
        let set = false
        if (searchParams.has("d")) {
            const value = getCustomQueryData("d");
            try {
                const output = await decompress(value);
                this.raw = JSON.parse(output) as Data;;
                if (this.raw.date) {
                    const date = new Date(this.raw.date);
                    this.setState({
                        date,
                        endMessage: this.raw.endMessage,
                        title: this.raw.title,
                        editable: false,
                        reminderPopup: true,
                    });
                    document.title = this.raw.title;
                    set = true;

                    if (date.getTime() < Date.now()) {
                        return;
                    }
    
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

    get renderPopup() {
        if(this.state.reminderPopup) {
            return <Popup 
            message="Do you want to be reminded?"
            option={{
                text: "Yes",
                onClick: async () => {
                    this.setState({reminderPopup: false})
                    let notification = false;
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
                    this.worker.addEventListener("message", () => {
                        document.title = this.raw.endMessage;
                    })
                    this.worker.postMessage({date: this.raw.date, notification, title: this.raw.endMessage});

                }
            }} 
            option2={{
                text: "No",
                onClick: () => {
                    this.setState({reminderPopup: false});
                }
            }} 
            
            />
        } 
        return null;
    }

    render() {
     return <>
        {this.renderPopup}
        {this.datePicker()}
        <Time date={this.state.date} title={this.state.title} endMessage={this.state.endMessage} end={this.state.previewEnd}/>
     </> 
    }
}

// Should give us raw query data
function getCustomQueryData(letter: string) {
    const search = location.search;
    const questionMarkIndex = search.indexOf('?');
    const actualSearch = search.slice(questionMarkIndex + 1);
    if (actualSearch.startsWith(`${letter}=`)) {
        return actualSearch.slice(2)
    }
    return undefined;
}