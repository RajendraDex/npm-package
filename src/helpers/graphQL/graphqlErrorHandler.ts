// src/utils/graphqlErrorHandler.ts

import { GraphQLError } from 'graphql';

/**
 * Formats GraphQL errors to provide custom error messages and details.
 * @param error - The GraphQLError object containing error details.
 * @returns An object containing the formatted error message and fields.
 */
export const formatGraphQLErrors = (error: GraphQLError) => {
    const errorDetails = {
        message: error.message,
        fields: error.path ? error.path : [error.extensions?.code],
        statusCode: 500 // Default to internal server error
    };

    // Customize the error message for undefined fields
    if (error.message.startsWith("Cannot query field")) {
        errorDetails.message = "Requested field is not available in the schema.";
        errorDetails.fields = [error.message.split(" ")[3].replace(/\"/g, '')];
        errorDetails.statusCode = 400; // Bad request
    }

    //customizations based on error.extensions.code
    switch (error.extensions?.code) {
        case 'UNAUTHENTICATED':
            errorDetails.statusCode = 401; // Unauthorized
            break;
        case 'FORBIDDEN':
            errorDetails.statusCode = 403; // Forbidden
            break;
        case 'VALIDATION_FAILED':
            errorDetails.statusCode = 422; // Unprocessable Entity
            break;
        default:
            break;
    }

    return errorDetails;
};
