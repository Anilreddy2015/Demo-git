public with sharing class AccountPaginationController {
    
    /**
     * Fetches Account records using LDS caching
     * @return List<Account> - List of Account records with selected fields
     */
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        try {
            return [
                SELECT Id, Name, Industry, Phone, Type
                FROM Account
                WITH USER_MODE
                ORDER BY Name ASC
                LIMIT 200
            ];
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching accounts: ' + e.getMessage());
        }
    }
}