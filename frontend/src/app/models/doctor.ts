import Examination from "./examinations";

export default class Doctor{
    username: string;
    password: string;
    name: string;
    lastname: string;
    address: string;
    phone: string;
    email: string;
    licence: number;
    specialty: string;
    department: string;
    id: number;
    profilePhoto: string;
    examinations: Array<Examination>;
     // for when the manager wants to update a patient
     gettingUpdated: boolean = false;
}