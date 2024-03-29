import React, { useEffect, useRef } from 'react';
import { Messages } from 'primereact/messages';
import { Message } from 'primereact/message';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

export default function MessagesDemo(){
    const msgs1 = useRef(null);
    const msgs2 = useRef(null);
    const msgs3 = useRef(null);

    useEffect(() => {
        msgs1.current.show([
            { severity: 'success', summary: 'Success', detail: 'Message Content', sticky: true },
            { severity: 'info', summary: 'Info', detail: 'Message Content', sticky: true },
            { severity: 'warn', summary: 'Warning', detail: 'Message Content', sticky: true },
            { severity: 'error', summary: 'Error', detail: 'Message Content', sticky: true }
        ]);

        msgs3.current.show({
            severity: 'info', sticky: true, content: (
                <React.Fragment>
                    <img alt="logo" src="showcase/images/logo.png" onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} width="32" />
                    <div className="p-ml-2">Always bet on Prime.</div>
                </React.Fragment>
            )
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const addMessages = () => {
        msgs2.current.show([
            { severity: 'success', summary: 'Success', detail: 'Message Content', sticky: true },
            { severity: 'info', summary: 'Info', detail: 'Message Content', sticky: true },
            { severity: 'warn', summary: 'Warning', detail: 'Message Content', sticky: true },
            { severity: 'error', summary: 'Error', detail: 'Message Content', sticky: true }
        ]);
    }

    const clearMessages = () => {
        msgs2.current.clear();
    }

    return (
        <div>
            <div className="card">
                <h5>Severities</h5>
                <Messages ref={msgs1} />

                <h5>Dynamic</h5>
                <Button type="button" onClick={addMessages} label="Show" className="p-mr-2" />
                <Button type="button" onClick={clearMessages} icon="pi pi-times" label="Clear" className="p-button-secondary" />

                <Messages ref={msgs2} />

                <h5>Static Content</h5>
                <Messages ref={msgs3} />

                <h5>Inline Message</h5>
                <p>Message component is used to display inline messages mostly within forms.</p>
                <div className="p-grid">
                    <div className="p-col-12 p-md-3">
                        <Message severity="info" text="Message Content" />
                    </div>
                    <div className="p-col-12 p-md-3">
                        <Message severity="success" text="Message Content" />
                    </div>
                    <div className="p-col-12 p-md-3">
                        <Message severity="warn" text="Message Content" />
                    </div>
                    <div className="p-col-12 p-md-3">
                        <Message severity="error" text="Message Content" />
                    </div>
                </div>

                <h5>Validation Message</h5>
                <div className="p-formgroup-inline p-mb-2">
                    <label htmlFor="username1" className="p-sr-only">Username</label>
                    <InputText id="username1" placeholder="Username" className="p-invalid p-mr-2" />
                    <Message severity="error" text="Username is required" />
                </div>
                <div className="p-formgroup-inline">
                    <label htmlFor="email" className="p-sr-only">email</label>
                    <InputText id="email" placeholder="Email" className="p-invalid p-mr-2" />
                    <Message severity="error" />
                </div>

                <h5>Form Layout</h5>
                <div className="p-field p-fluid">
                    <label htmlFor="username2">Username</label>
                    <InputText id="username2" aria-describedby="username-help" className="p-invalid p-mr-2" />
                    <small id="username-help" className="p-error">Username is not available.</small>
                </div>
            </div>
        </div>
    )
}