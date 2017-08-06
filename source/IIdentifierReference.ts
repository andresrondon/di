/**
 * Represents a reference of the identifier that is been modified.
 */
export interface IIdentifierReference {
    /**
     * Returns the identifier.
     * @returns {string} The context identifier.
     */
    getIdentifier():string;
}