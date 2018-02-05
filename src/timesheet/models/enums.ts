export enum Days {
    Mon = 0,
    Tue = 1,
    Wed = 2,
    Thur = 3,
    Fri = 4,
    Sat = 5,
    Sun = 6
}
export const DayNames = Object.keys(Days).filter(key => !isNaN(Number(Days[key])));

export const Day = {
    'Mon': Days.Mon,
    'Tue': Days.Tue,
    'Wed': Days.Wed,
    'Thur': Days.Thur,
    'Fri': Days.Fri,
    'Sat': Days.Sat,
    'Sun': Days.Sun
};