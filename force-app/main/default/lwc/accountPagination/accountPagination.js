import { LightningElement } from 'lwc';
import getAccounts from '@salesforce/apex/AccountPaginationController.getAccounts';

const RECORDS_PER_PAGE = 15;

export default class AccountPagination extends LightningElement {
    accounts = [];
    allAccounts = [];
    currentPage = 1;
    totalPages = 0;
    error;
    isLoading = true;

    // Fetch Account records when component loads
    connectedCallback() {
        this.loadAccounts();
    }

    // Load accounts using Apex
    loadAccounts() {
        this.isLoading = true;
        getAccounts()
            .then(result => {
                this.allAccounts = result;
                this.totalPages = Math.ceil(this.allAccounts.length / RECORDS_PER_PAGE);
                this.updateDisplayedRecords();
                this.error = undefined;
                this.isLoading = false;
            })
            .catch(error => {
                this.error = error;
                this.allAccounts = [];
                this.accounts = [];
                this.isLoading = false;
            });
    }

    // Update displayed records based on current page
    updateDisplayedRecords() {
        const startIndex = (this.currentPage - 1) * RECORDS_PER_PAGE;
        const endIndex = startIndex + RECORDS_PER_PAGE;
        this.accounts = this.allAccounts.slice(startIndex, endIndex);
    }

    // Handle previous page navigation
    handlePrevious() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updateDisplayedRecords();
        }
    }

    // Handle next page navigation
    handleNext() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.updateDisplayedRecords();
        }
    }

    // Handle first page navigation
    handleFirst() {
        this.currentPage = 1;
        this.updateDisplayedRecords();
    }

    // Handle last page navigation
    handleLast() {
        this.currentPage = this.totalPages;
        this.updateDisplayedRecords();
    }

    // Computed properties for button states
    get isFirstPage() {
        return this.currentPage === 1;
    }

    get isLastPage() {
        return this.currentPage === this.totalPages;
    }

    get hasRecords() {
        return this.accounts && this.accounts.length > 0;
    }

    get displayInfo() {
        const startRecord = (this.currentPage - 1) * RECORDS_PER_PAGE + 1;
        const endRecord = Math.min(this.currentPage * RECORDS_PER_PAGE, this.allAccounts.length);
        return `Showing ${startRecord}-${endRecord} of ${this.allAccounts.length} records`;
    }

    get pageInfo() {
        return `Page ${this.currentPage} of ${this.totalPages}`;
    }
}