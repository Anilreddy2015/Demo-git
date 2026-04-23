import { LightningElement, api, wire, track } from 'lwc';
import getAccountCases from '@salesforce/apex/CaseController.getAccountCases';

export default class AccountCaseTable extends LightningElement {
  @api recordId;
  @track records;

  @wire(getAccountCases, { accountId: '$recordId' })
  wiredCases({ data, error }) {
    if(data){
      this.records=data;
    }
    if(error){
      this.error=error;
      }
  }
}