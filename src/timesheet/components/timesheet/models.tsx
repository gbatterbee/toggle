export interface TimesheetEntry {
    projectId: number;
    projectName: string;
    tagId: number;
    tagName: string;
    days: Entry[];
}

export interface Entry {
    time: string;
    description: string;
}

export interface TimeChangedArgs {
    projectId: number;
    tagId: number;
    day: number;
    hours: string;
}

export interface DescriptionChangedArgs {
    projectId: number;
    tagId: number;
    day: number;
    description: string;
}

export interface Project { projectId: number; projectName: string; }