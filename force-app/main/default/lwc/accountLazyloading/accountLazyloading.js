import { LightningElement } from 'lwc';
import getAccountsWithPagination from '@salesforce/apex/AccountLazyLoadingController.getAccountsWithPagination';

const RECORDS_PER_PAGE = 12;

export default class AccountLazyloading extends LightningElement {
    accounts = [];
    currentPage = 1;
    totalRecords = 0;
    error;
    isLoading = false;
    hasMoreRecords = true;

    // Fetch Account records when component loads
    connectedCallback() {
        this.loadMoreAccounts();
    }

    // Load more accounts with infinite scroll
    loadMoreAccounts() {
        if (this.isLoading || !this.hasMoreRecords) {
            return;
        }

        this.isLoading = true;
        getAccountsWithPagination({ 
            pageNumber: this.currentPage, 
            pageSize: RECORDS_PER_PAGE 
        })
            .then(result => {
                if (result.accounts.length > 0) {
                    // Append new records to existing ones
                    this.accounts = [...this.accounts, ...result.accounts];
                    this.totalRecords = result.totalRecords;
                    this.currentPage++;
                    
                    // Check if there are more records to load
                    this.hasMoreRecords = this.accounts.length < this.totalRecords;
                } else {
                    this.hasMoreRecords = false;
                }
                this.error = undefined;
                this.isLoading = false;
            })
            .catch(error => {
                this.error = error;
                this.isLoading = false;
                this.hasMoreRecords = false;
            });
    }

    // Handle scroll event
    handleScroll(event) {
        const target = event.target;
        const scrollTop = target.scrollTop;
        const scrollHeight = target.scrollHeight;
        const clientHeight = target.clientHeight;
        
        // Load more when scrolled to bottom (with 50px threshold)
        if (scrollHeight - scrollTop <= clientHeight + 50) {
            this.loadMoreAccounts();
        }
    }

    get hasRecords() {
        return this.accounts && this.accounts.length > 0;
    }

    get displayInfo() {
        if (this.totalRecords === 0) {
            return 'No records to display';
        }
        return `Showing ${this.accounts.length} of ${this.totalRecords} records`;
    }

    get showLoadingSpinner() {
        return this.isLoading && this.accounts.length > 0;
    }

    get showInitialLoading() {
        return this.isLoading && this.accounts.length === 0;
    }
}
