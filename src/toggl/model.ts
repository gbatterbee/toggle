export interface Tag {
    id: number;
    workspace_id: number;
    name: string;
}
export const tags: Tag[] =
    [
        {
            id: 972666,
            workspace_id: 792899,
            name: 'Admin',
        },
        {
            id: 972665,
            workspace_id: 792899,
            name: 'Architecture/Design',
        },
        {
            id: 970595,
            workspace_id: 792899,
            name: 'BA/PM',
        }
    ];

export interface Project {
    id: number;
    name: string;
    is_private: boolean;
    active: boolean;
    wid: number;
    cid: number;
}
export const projects: Project[] =
    [
        {
            id: 11887936,
            name: 'Brandbank US',
            is_private: false,
            active: true,
            wid: 792899,
            cid: 18026123
        },
        {
            id: 11311299,
            name: 'Rejections Management',
            is_private: false,
            active: true,
            wid: 792899,
            cid: 18026123
        },
        {
            id: 8729763,
            name: 'KTLO',
            is_private: false,
            active: true,
            wid: 792899,
            cid: 18026146
        }
    ];
