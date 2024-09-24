export default class Patient{
    username: string;
    password: string;
    name: string;
    lastname: string;
    address: string;
    phone: string;
    email: string;
    id: number;
    profilePhoto:string;
    // for when the manager wants to update a patient
    gettingUpdated: boolean = false;
}