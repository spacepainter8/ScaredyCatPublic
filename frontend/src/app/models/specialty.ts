import Examination from "./examinations";

export default class Specialty {
    id: number;
    name: string;
    examinations: Array<Examination>;
}