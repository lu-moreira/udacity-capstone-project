
// DynamoDb doesn't support post items if empty strings
// https://github.com/aws/aws-sdk-js/issues/833#issuecomment-229268626
export function removeEmptyStringElements(obj: any): any {
    for (var prop in obj) {
        if (typeof obj[prop] === 'object') {    // dive deeper in
            removeEmptyStringElements(obj[prop]);
        } else if (obj[prop] === '') {  // delete elements that are empty strings
            delete obj[prop];
        }
    }
    return obj;
};