public with sharing class AccountLazyLoadingController {
    
    /**
     * Wrapper class to return both accounts and total count
     */
    public class PaginationResult {
        @AuraEnabled
        public List<Account> accounts { get; set; }
        @AuraEnabled
        public Integer totalRecords { get; set; }
        
        public PaginationResult(List<Account> accounts, Integer totalRecords) {
            this.accounts = accounts;
            this.totalRecords = totalRecords;
        }
    }
    
    /**
     * Fetches Account records with server-side pagination (lazy loading)
     * Only fetches the requested page of records, not all records
     * @param pageNumber - The page number to fetch (1-based)
     * @param pageSize - Number of records per page
     * @return PaginationResult - Contains the accounts for the current page and total record count
     */
    @AuraEnabled(cacheable=true)
    public static PaginationResult getAccountsWithPagination(Integer pageNumber, Integer pageSize) {
        try {
            // Validate inputs
            if (pageNumber == null || pageNumber < 1) {
                pageNumber = 1;
            }
            if (pageSize == null || pageSize < 1) {
                pageSize = 12;
            }
            
            // Calculate offset for pagination
            Integer offset = (pageNumber - 1) * pageSize;
            
            // Get total count of records (used for calculating total pages)
            Integer totalRecords = [
                SELECT COUNT() 
                FROM Account 
                WITH USER_MODE
            ];
            
            // Fetch only the records for the current page
            List<Account> accounts = [
                SELECT Id, Name, Industry, Phone, Type
                FROM Account
                WITH USER_MODE
                ORDER BY Name ASC
                LIMIT :pageSize
                OFFSET :offset
            ];
            
            return new PaginationResult(accounts, totalRecords);
            
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching accounts: ' + e.getMessage());
        }
    }
}