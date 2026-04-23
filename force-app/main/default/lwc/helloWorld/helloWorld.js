import { LightningElement } from 'lwc';

export default class HelloWorld extends LightningElement {
    greeting = 'Hello World';
    currentDate = new Date().toLocaleDateString();

    handleGreetingChange(event) {
        this.greeting = event.target.value;
    }
}