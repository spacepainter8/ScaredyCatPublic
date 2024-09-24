export class Notification {
    id: number;
    text: string;
    for: Array<string>;
    type: string;
    read: Array<string>;
    // this is just for the notifs page
    readByMe: boolean=false;
}